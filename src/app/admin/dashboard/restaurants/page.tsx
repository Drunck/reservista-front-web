import { getAllRestaurants } from "@/lib/api"
import { DataTable } from "./data-table";
import { restaurantColumns } from "./columns";
import { TRestaurantsResponse } from "@/lib/types";
import Link from "next/link";
import { CreateRestaurantButton } from "./create-restaurant-button";
import { Button } from "@/ui/custom-components/button";

export default async function RestaurantsPage() {
  const restaurantsData: TRestaurantsResponse = await getAllRestaurants();
  const data = restaurantsData.restaurants || []; // Assign an empty array if restaurantsData.restaurants is undefined
  return (
    <div className="p-4 flex flex-col space-y-5">
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Search" className="box-border bg-white border px-4 py-2 rounded max-w-fit float-right text-sm focus:outline outline-1" />
        {/* <Link href="/admin/dashboard/restaurants/create" className="box-border bg-white border-black border px-4 py-2 rounded max-w-fit float-left transition hover:bg-zinc-100 active:border-gray-400 text-sm">
          <span>Add Restaurant</span>
        </Link> */}
        <CreateRestaurantButton />
      </div>
      <DataTable columns={restaurantColumns} data={data} />
    </div>
  )
}
