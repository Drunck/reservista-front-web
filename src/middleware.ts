import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, privateRoutes, authRoutes, activetedUserRoutes } from "./routes";

const convertRouteToRegex = (route: string) => new RegExp(`^${route.replace(/\[([^\]]+)\]/g, '[^/]+')}$`);

const privateRouteRegexes = privateRoutes.map(convertRouteToRegex);
const activatedUserRouteRegexes = activetedUserRoutes.map(convertRouteToRegex);


export async function middleware(request: NextRequest) {
    try {
        const { nextUrl } = request;
        const cookies = request.headers.get("cookie") || "";
        let isUserActivated: boolean = false;

        const apiResponse = await fetch("http://localhost:3000/api/auth/validate", {
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
        }
        console.log("Is user activated", isUserActivated);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/healthcheck`;
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies,
            },
        });

        const isAuth = response.ok;
        const isAuthRoute = authRoutes.includes(nextUrl.pathname);
        const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
        const isPrivateRoute = privateRouteRegexes.some(regex => regex.test(nextUrl.pathname));
        const isRouteForActivatedUser = activatedUserRouteRegexes.some(regex => regex.test(nextUrl.pathname));

        if ((isUserActivated && nextUrl.pathname === "/activate" && isAuth) || (!isAuth && nextUrl.pathname === "/activate")) {
            return NextResponse.redirect(new URL("/", request.url));
        } else if (!isUserActivated && isRouteForActivatedUser) {
            const redirectUrl = new URL("/activate", request.url);
            redirectUrl.searchParams.set("redirect", nextUrl.href);
            return NextResponse.redirect(redirectUrl);
        } else if (isAuthRoute && isAuth) {
            return NextResponse.redirect(new URL("/", request.url));
        } else if ((isPrivateRoute || isRouteForActivatedUser) && !isAuth) {
            const redirectUrl = new URL("/sign-in", request.url);
            redirectUrl.searchParams.set("redirect", nextUrl.href);
            return NextResponse.redirect(redirectUrl);
        }

        return NextResponse.next();
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
