"use client";

import { useEffect, useState } from "react";
import { TableButton, TimeButton } from "./components";
import { getAllReservationsByRestaurantId, getRestaurantById, getTablesByRestaurantId, makeTableReservation } from "@/lib/api";
import { TRestaurant, TRestaurantReservation, TRestaurantTables, times } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/components/button";
import useAuth from "@/lib/hooks/use-auth";
import { MapPointIcon } from "@/ui/components/icons";
import Image from "next/image";
import useMediaQuery from "@/lib/hooks/use-media-query";
import MobileTopNavigationBar from "@/ui/components/mobile-top-navigation-bar";
import { useToast } from "@/components/ui/use-toast";

export default function TableBooking({ params }: { params: { restaurantId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast()
  const { auth } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const restaurantId = params.restaurantId;
  const time = searchParams.get("time") || times[0];
  const [restaurant, setRestaurant] = useState<TRestaurant>({
    id: "",
    name: "",
    address: "",
    contact: "",
  });
  const [reservations, setReservations] = useState<TRestaurantReservation[]>([]);
  const [tables, setTables] = useState<TRestaurantTables[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(times[0]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [reservationStatus, setReservationStatus] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (time && typeof time === "string") {
      setSelectedTime(decodeURIComponent(time));
    } else {
      setSelectedTime(times[0]);
    }
  }, [time]);

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await getAllReservationsByRestaurantId(restaurantId);
      if (response.status === 200 && response.data.reservations) {
        setReservations(
          response.data.reservations.map((res: any) => ({
            id: res.id,
            table_id: res.table.id,
            reservation_time: res.reservationTime,
          }))
        );
      } else if (response.status === 200 && !response.data.reservations) {
        setReservations([]);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Problem while fetching reservations.",
          description: "There was a problem while fetching reservations. Please try again later.",
        })
      }
    };

    const fetchTables = async () => {
      const response = await getTablesByRestaurantId(restaurantId);
      if (response && response.tables) {
        setTables(
          response.tables.map((res: any) => ({
            id: res.id,
            table_number: res.TableNumber,
            number_of_seats: res.NumberOfSeats,
            status: "available", // Initialize status as available
          }))
        );
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Problem while fetching tables.",
          description: "There was a problem while fetching tables. Please try again later.",
        })
      }
    };

    const getRestaurant = async () => {
      const restaurant = await getRestaurantById(restaurantId);
      if (restaurant) {
        setRestaurant(restaurant);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Problem while fetching restaurant information.",
          description: "There was a problem while fetching restaurant information. Please try again later.",
        })
      }
    }

    getRestaurant();
    fetchReservations();
    fetchTables();
  }, [restaurantId, toast]);

  useEffect(() => {
    if (selectedTime) {
      const reservedTables = reservations
        .filter(reservation => reservation.reservation_time === selectedTime)
        .map(reservation => reservation.table_id);

      setTables(tables => tables.map(table => ({
        ...table,
        status: reservedTables.includes(table.id) ? "reserved" : "available",
      })));
    } else {
      setTables(tables => tables.map(table => ({
        ...table,
        status: "available",
      })));
    }
  }, [selectedTime, reservations]);

  const handleTimeButtonClick = (time: string) => {
    setSelectedTime(time);
    router.replace(`/restaurants/${restaurantId}/booking?time=${encodeURIComponent(time)}`);
  };

  const handleReservation = async () => {
    if (auth.user_id && selectedTime && selectedTable !== null) {
      const selectedTableId = tables.find(table => table.table_number === selectedTable)?.id;
      if (selectedTableId) {
        const formData = {
          user_id: auth.user_id as string,
          table_id: selectedTableId,
          reservation_time: selectedTime,
        };
        const response = await makeTableReservation(formData);
        if (response.status === 200 || response.status === 201) {
          toast({
            variant: "green",
            title: "Reservation successful!",
            description: "Your reservation has been successfully made.",
          })
          setReservationStatus("Reservation successful!");
          const fetchReservations = async () => {
            try {
              const response = await getAllReservationsByRestaurantId(restaurantId);
              if (response.status === 200 && response.data.reservations) {
                setReservations(
                  response.data.reservations.map((res: any) => ({
                    id: res.id,
                    table_id: res.table.id,
                    reservation_time: res.reservationTime,
                  }))
                );
              }
            } catch (error) {
              console.error("Error fetching reservations: ", error);
            }
          };
          fetchReservations();
        } else {
          setReservationStatus("Failed to make reservation.");
        }
      }
    } else {
      setReservationStatus("Please select a time and a table.");
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!isDesktop && (
        <MobileTopNavigationBar menuName="Book a Table" />
      )}
      <div className="min-h-screen w-full max-w-full flex flex-col py-10 px-4 lg:p-0 lg:px-4">
        {isDesktop && <h1 className="text-2xl font-bold mb-6">Book a Table</h1>}
        <div className="flex flex-row w-full gap-x-4 mb-6 border-b pb-6">
          <div className="relative flex w-full max-w-24 min-h-full max-h-24 bg-zinc-200 rounded-md overflow-hidden">
            {
              (restaurant.image_urls) ? (
                <Image className="w-full h-full object-cover" src={`${restaurant.image_urls[0]}`} alt={restaurant.name} fill priority />
              ) : (
                <Image src="/images/restaurants/tanuki.png" alt="Restaurant" className="w-full h-full object-cover" fill priority />
              )
            }
          </div>
          <div className="flex flex-col gap-4 relative">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <div className="relative flex flex-row items-center gap-x-1">
                <MapPointIcon className="w-4 h-4 fill-gray-500" />
                <p className="text-base truncate text-zinc-500">{restaurant.address}</p>
              </div>
              <p className="text-base text-zinc-500">Cuisine</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl mb-4 font-semibold">Time</h2>
          <div className="flex flex-row flex-wrap gap-4">
            {times.map(time => (
              <TimeButton
                key={time}
                time={time}
                selected={time === selectedTime}
                onClick={() => handleTimeButtonClick(time)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <h2 className="text-xl font-semibold">Choose Table</h2>
          <div className="flex gap-x-5">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="w-5 h-5 rounded-md border border-black flex justify-center items-center"></div>
              <p className="text-sm md:text-base">Available</p>
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              <div className="w-5 h-5 rounded-md border bg-red-200 border-red-400 flex justify-center items-center"></div>
              <p className="text-sm md:text-base">Reserved</p>
            </div>
            <div className="flex flex-row gap-x-2 items-center">
              <div className="w-5 h-5 rounded-md border bg-black border-black flex justify-center items-center"></div>
              <p className="text-sm md:text-base">Selected</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {tables.map(table => (
              <TableButton
                key={table.id}
                tableNumber={table.table_number}
                status={table.status === "reserved" ? "reserved" : table.table_number === selectedTable ? "selected" : "available"}
                onClick={() => table.status === "available" && setSelectedTable(table.table_number)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-start gap-y-5 mt-10">
          <Button className="px-4 py-2 rounded-md max-w-64" onClick={handleReservation}>Reserve Table</Button>
        </div>
      </div>
    </>
  );
}
