import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

type JWTVerifyError = {
  code: object;
  name: string;
  claim: string;
  reason: string;
};

export async function POST(request: NextRequest) {
  const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SIGNING_KEY);
  const cookies = request.headers.get("cookie") || "";
  const token = request.cookies.get("jwt")?.value || "";

  if (token !== "") {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/healthcheck`;
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookies,
        },
      });

      const isUserAuth = response.ok;
      if (!isUserAuth) {
        return NextResponse.json({ status: "error", message: "Unauthorized: Invalid token" });
      }

      const { payload } = await jwtVerify(token, secretKey);
      return NextResponse.json({ status: "ok", user: { id: payload.user_id, roles: payload.roles } });
    }
    catch (error: JWTVerifyError | any) {
      return NextResponse.json({ status: "error", message: error.code });
    }
  } else {
    return NextResponse.json({ status: "error", message: "Unauthorized: No token provided" });
  }
}
