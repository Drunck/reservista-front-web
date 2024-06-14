"use client";

import { useToast } from "@/components/ui/use-toast";
import { confirmReservation, getReservationById, getUserById } from "@/lib/api";
import { TReservation, TUser, reservationIdSchema } from "@/lib/types";
import { Button } from "@/ui/custom-components/button";
import { MapPointIcon } from "@/ui/custom-components/icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmReservation({ params }: { params: { reservationId: string } }) {
  const reservationId = params.reservationId;
  const router = useRouter();
  const [reservation, setReservation] = useState<TReservation & {
    userID: string;
  }>();
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {toast} = useToast();

  useEffect(() => {
    const result = reservationIdSchema.safeParse(reservationId);
    if (!result.success) {
      router.push("/404");
      return;
    }

    const fetchReservation = async () => {
      try {
        const response = await getReservationById(reservationId);
        if (response) {
          console.log(response)
          setReservation(response);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.error(error);
        router.push("/404");
      }
    };

    fetchReservation();
    setIsMounted(true);
  }, [reservationId, router]);

  useEffect(() => {
    if (reservation?.userID) {
      const fetchUser = async () => {
        try {
          const user = await getUserById(reservation.userID);
          setUser(user);
        } catch (error) {
          console.error(error);
        }
      };

      fetchUser();
    }
  }, [reservation]);

  const handleReservation = async () => {
    if (!reservation) return;

    setIsLoading(true);

    try {
      const response = await confirmReservation(reservation.id);
      if (response.status === 200) {
        toast({
          title: "Reservation confirmed",
          description: "You have successfully confirmed the reservation.",
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error confirming reservation: ", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted || !reservation || !user) {
    return null;
  }

  if (!isMounted || !reservation || !user) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen lg:min-h-full">
      <div className="flex flex-col gap-y-5 text-sm md:text-base max-w-xl mx-auto border p-4 rounded-lg w-full">
        <div className="flex flex-row w-full gap-x-4 pb-5 border-b">
          <div className="flex flex-col gap-4 relative">
            <div className="col-span-2">
              <h3 className="text-base font-semibold">{reservation.table?.restaurant.name}</h3>
              <div className="relative flex flex-row items-center gap-x-1">
                <MapPointIcon className="w-4 h-4 fill-gray-500" />
                <p className="text-sm truncate text-zinc-500">{reservation.table?.restaurant.address}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 border-b pb-5">
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">User name</span>
            <span className="font-bold">{user.name} {user.surname}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Phone number</span>
            <span className="font-bold">{user.phone}</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Date</span>
            <span className="font-bold">{format(new Date(reservation.reservationDate?.seconds * 1000), "dd.MM.yyyy")}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Time</span>
            <span className="font-bold">{reservation.reservationTime}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Table number</span>
            <span className="font-bold">{reservation.table.TableNumber}</span>
          </div>
          <div className="flex flex-row justify-between items-center gap-x-3">
            <span className="text-gray-500 text-nowrap">Number of seats</span>
            <span className="font-bold">{reservation.table.NumberOfSeats}</span>
          </div>
        </div>
        <div className="flex flex-row-reverse w-full">
          <Button
            className="px-4 py-2 rounded-md w-full md:max-w-64"
            onClick={handleReservation}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex flex-row items-center justify-center gap-x-2">
                <div className="w-4 h-4 border-t-2 border-r-2 border-gray-500 rounded-full animate-spin"></div>
                <span>Confirming...</span>
              </div>
            ) : (
              <span>Confirm reservation</span>
            )}
          </Button>
        </div>
      </div>
    </div>

  );
}
