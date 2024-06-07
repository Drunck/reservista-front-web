import { getAllRestaurants } from "@/lib/api"
import { DataTable } from "./data-table";
import { restaurantColumns } from "./columns";
import { TRestaurantsResponse } from "@/lib/types";

export default async function RestaurantsPage() {
  const restaurantsData: TRestaurantsResponse = await getAllRestaurants();
  const data = restaurantsData.restaurants || []; // Assign an empty array if restaurantsData.restaurants is undefined
  return (
    <div className="px-4 py-10">
      <DataTable columns={restaurantColumns} data={data} />
    </div>
  )
}
