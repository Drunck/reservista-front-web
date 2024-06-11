import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/restaurants/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application json",
        "Cookie": cookies,
      },
      credentials: "include",
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      throw new Error("Error while adding restaurant");
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error }, { status: error.status || 500 });
  }
}