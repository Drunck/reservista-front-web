import { NextRequest, NextResponse } from "next/server";
import { publicRoutes, privateRoutes, authRoutes } from "./routes";

const convertRouteToRegex = (route: string) => new RegExp(`^${route.replace(/\[([^\]]+)\]/g, '[^/]+')}$`);

const privateRouteRegexes = privateRoutes.map(convertRouteToRegex);


export async function middleware(request: NextRequest) {
    try {
        const { nextUrl } = request;
        const cookies = request.headers.get("cookie") || "";

        // const apiResponse = await fetch("http://localhost:3000/api/auth/validate", {
        //     method: "POST",
        //     credentials: "include",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Cookie": cookies,
        //     },
        // });
        // const data = await apiResponse.json();
        // if (data.status !== "ok") {
        //     console.log("API Response Message token verification error", data.status, data.message);
        // } else {
        //     console.log("API Response Message", data.status, data.message);
        // }
        const apiUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/healthcheck`;
        const response = await fetch(apiUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookies,
            },
        });

        const isAuth = response.ok && (await response.json()).status === "ok";
        const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
        const isPrivateRoute = privateRouteRegexes.some(regex => regex.test(nextUrl.pathname));
        console.log("Is private route", nextUrl.pathname, isPrivateRoute, isAuth);
        const isAuthRoute = authRoutes.includes(nextUrl.pathname);

        if (isAuthRoute && isAuth) {
            return NextResponse.redirect(new URL("/", request.url));
        } else if (isPrivateRoute && !isAuth) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
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
