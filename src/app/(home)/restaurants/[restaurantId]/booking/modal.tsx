import { TRestaurant, TRestaurantTables } from "@/lib/types";
import { Button } from "@/ui/custom-components/button";
import { MapPointIcon } from "@/ui/custom-components/icons";
import { ResponsiveDrawerDialog } from "@/ui/custom-components/responsive-drawer-dialog";
import { format } from "date-fns";
import Image from "next/image";

type ModalProps = {
  restaurant: TRestaurant;
  selectedTable: TRestaurantTables;
  selectedTime: string;
  handleReservation: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export default function Modal({ restaurant, selectedTable, selectedTime, handleReservation, open, setOpen }: ModalProps) {
  return (
    <ResponsiveDrawerDialog title="Reservation details" triggerButtonText="Continue" closeButtonText="Close" open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-y-5 text-sm md:text-base">
        <div className="flex flex-row w-full gap-x-4 pb-5 border-b">
          <div className="relative flex w-full max-w-24 h-16 max-h-24 bg-zinc-200 rounded-md overflow-hidden">
            {
              (restaurant.image_urls) ? (
                <Image className="w-full h-full object-cover" src={`${restaurant.image_urls[0]}`} alt={restaurant.name} fill priority />
              ) : (
                <div className="w-full h-full bg-zinc-200"></div>
              )
            }
          </div>
          <div className="flex flex-col gap-4 relative">
            <div className="col-span-2">
              <h3 className="text-base font-semibold">{restaurant.name}</h3>
              <div className="relative flex flex-row items-center gap-x-1">
                <MapPointIcon className="w-4 h-4 fill-gray-500" />
                <p className="text-sm truncate text-zinc-500">{restaurant.address}</p>
              </div>
              {/* <p className="text-sm text-zinc-500">Cuisine</p> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Date</span>
            <span className="font-bold">{format(new Date(), "dd.MM.yyyy")}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Time</span>
            <span className="font-bold">{selectedTime}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Table number</span>
            <span className="font-bold">{selectedTable?.table_number}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Number of seats</span>
            <span className="font-bold">{selectedTable?.number_of_seats}</span>
          </div>
        </div>
        <div className="flex flex-row-reverse w-full">
          <Button className="px-4 py-2 rounded-md w-full md:max-w-64" onClick={handleReservation}>Book Table</Button>
        </div>
      </div>
    </ResponsiveDrawerDialog>
  )
}
