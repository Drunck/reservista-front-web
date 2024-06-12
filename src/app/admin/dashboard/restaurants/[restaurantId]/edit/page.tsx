import { getRestaurantById, getTablesByRestaurantId } from "@/lib/api";
import EditRestaurantForm from "./form";

export default async function EditPage({ params }: { params: { restaurantId: string } }) {
  const restaurantId = params.restaurantId;

  const restaurantResponse = getRestaurantById(restaurantId);
  const tablesResponse = getTablesByRestaurantId(restaurantId);
  const [restaurant, tables] = await Promise.all([restaurantResponse, tablesResponse])

  if (!restaurant || !tables) {
    return <div>Restaurant not found</div>;
  }

  const restaurantWithId = { ...restaurant, id: restaurantId }

  return (
    <div className="p-4 pb-20 lg:pb-10">
      <div className="mx-auto">
        <EditRestaurantForm restaurant={restaurantWithId} restaurant_tables={tables.tables} />
      </div>
    </div>
  );
}
