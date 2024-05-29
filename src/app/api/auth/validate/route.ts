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
  const token = request.cookies.get("jwt")?.value || "";

  if (token !== "") {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      return NextResponse.json({ status: "ok", user_id: payload.user_id });
    }
    catch (error: JWTVerifyError | any) {
      return NextResponse.json({ status: "error", message: error.code });
    }
  } else {
    return NextResponse.json({ status: "error", message: "No token found" });
  }
}
