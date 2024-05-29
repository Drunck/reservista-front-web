import { getAllReservationsByRestaurantId } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { restaurantId: string } }) {
  try {
    const id = params.restaurantId;
    const response = await getAllReservationsByRestaurantId(id);
    if (response.ok) {
      const data = response.json();
      // console.log(data);
      return NextResponse.json({ status: "ok" });
    }
  } catch (error) {
    console.error("Error fetching reservations: ", error);
    return NextResponse.json({ status: "error", message: error });
  }
}