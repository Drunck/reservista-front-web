import { NextRequest, NextResponse } from "next/server";
import {
    publicRoutes,
    privateRoutes,
    authRoutes,
    activetedUserRoutes,
    adminRoutes,
    confirmReservationRoute,
} from "./routes";

const convertRouteToRegex = (route: string) => new RegExp(`^${route.replace(/\[([^\]]+)\]/g, '[^/]+')}$`);

const privateRouteRegexes = privateRoutes.map(convertRouteToRegex);
const activatedUserRouteRegexes = activetedUserRoutes.map(convertRouteToRegex);
const adminRouteRegexes = adminRoutes.map(convertRouteToRegex);
const confirmReservationRouteRegexes = confirmReservationRoute.map(convertRouteToRegex);

export async function middleware(request: NextRequest) {
    try {
        const { nextUrl } = request;
        const cookies = request.headers.get("cookie") || "";
        const token = request.cookies.get("jwt")?.value || "";
        let isUserActivated = false;
        let isAdmin = false;
        let isRestaurantAdmin = false;
        let isRestaurantEmployee = false;

        const internalApiUrl = `${process.env.NEXT_PUBLIC_DEV_URL}`;
        const apiResponse = await fetch(`${internalApiUrl}/api/auth/validate`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies,
            },
        });

        const data = await apiResponse.json();

        if (data.status === "ok") {
            isUserActivated = data.user.roles.includes("activated");
            isAdmin = data.user.roles.includes("admin");
            isRestaurantAdmin = data.user.roles.includes("restaurantAdmin");
            isRestaurantEmployee = data.user.roles.includes("waiter");
        }

        const isAuthRoute = authRoutes.includes(nextUrl.pathname);
        const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
        const isPrivateRoute = privateRouteRegexes.some((regex) => regex.test(nextUrl.pathname));
        const isRouteForActivatedUser = activatedUserRouteRegexes.some((regex) => regex.test(nextUrl.pathname));
        const isAdminRoute = adminRouteRegexes.some((regex) => regex.test(nextUrl.pathname));
        const isConfirmReservationRoute = confirmReservationRouteRegexes.some((regex) => regex.test(nextUrl.pathname));

        console.log("Request Pathname:", nextUrl.pathname);
        console.log("isConfirmReservationRoute:", isConfirmReservationRoute);

        if ((isPrivateRoute || isRouteForActivatedUser) && token === "") {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const isAuth = data.status === "ok";

        let redirectUrl = new URL("/sign-in", request.url);
        redirectUrl.searchParams.set("redirect", nextUrl.href);

        if ((isUserActivated && nextUrl.pathname === "/activate" && isAuth) || (!isAuth && nextUrl.pathname === "/activate")) {
            return NextResponse.redirect(new URL("/", request.url));
        } else if (!isUserActivated && isRouteForActivatedUser) {
            const redirect = new URL("/activate", request.url);
            redirect.searchParams.set("redirect", nextUrl.href);
            return NextResponse.redirect(redirect);
        } else if (isAuthRoute && isAuth) {
            return NextResponse.redirect(new URL("/", request.url));
        } else if ((isPrivateRoute || isRouteForActivatedUser) && !isAuth) {
            return NextResponse.redirect(redirectUrl);
        } else if (isAdminRoute && (!isAdmin || !isAuth)) {
            return NextResponse.redirect(redirectUrl);
        } else if (isConfirmReservationRoute && !isAuth) {
            return NextResponse.redirect(redirectUrl);
        } else if (isConfirmReservationRoute && (!isAdmin && !isRestaurantAdmin && !isRestaurantEmployee)) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("MIDDLEWARE ERROR", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
