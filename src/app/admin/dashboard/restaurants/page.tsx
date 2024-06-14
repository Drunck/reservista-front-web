import { getAllRestaurants } from "@/lib/api"
import { DataTable } from "./data-table";
import { restaurantColumns } from "./columns";
import { TRestaurantsResponse } from "@/lib/types";
import { CreateRestaurantButton } from "./create-restaurant-button";

export default async function RestaurantsPage() {
  const restaurantsData: TRestaurantsResponse = await getAllRestaurants();
  const data = restaurantsData.restaurants || []; // Assign an empty array if restaurantsData.restaurants is undefined
  return (
    <div className="p-4 flex flex-col space-y-5">
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Search" className="box-border bg-white border px-4 py-2 rounded max-w-fit float-right text-sm focus:outline outline-1" />
        <CreateRestaurantButton />
      </div>
      <DataTable columns={restaurantColumns} data={data} />
    </div>
  )
}
