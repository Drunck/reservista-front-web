"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cancelReservation, getUserReservations } from "@/lib/api";
import { FetchState, TReservation } from "@/lib/types";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { Button } from "@/ui/components/button";
import { CuisineIcon, HalfFullStarIcon, MapPointIcon } from "@/ui/components/icons";
import MobileTopNavigationBar from "@/ui/components/mobile-top-navigation-bar";
import { ResponsiveDrawerDialog } from "@/ui/components/responsive-drawer-dialog";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format, isBefore, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function UserBookingsComponent({ userId }: { userId: string }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [userReservations, setUserReservations] = useState<TReservation[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [FetchState, setFetchState] = useState<FetchState>("loading");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { toast } = useToast();

  const fetchUserReservations = async () => {
    const response = await getUserReservations();
    if (response && response.reservations) {
      setUserReservations(response.reservations);
    } else {
      setUserReservations([]);
      setServerError("An error occurred while fetching your reservations. Please try again later.");
    }
  }

  const handleConfirmCancel = async (reservationId: string) => {
    if (reservationId) {
      setFetchState("loading");
      const response = await cancelReservation({ id: reservationId });

      if (response.status === 200) {
        setFetchState("success");
        toast({
          variant: "green",
          title: "Reservation canceled successfully",
          description: "Your reservation has been canceled successfully.",
        });
        setDrawerOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Problem while canceling the reservation.",
          description: "An error occurred while cancelling your reservation. Please try again later.",
        });
      }
    }
  }

  useEffect(() => {
    fetchUserReservations();
    setIsMounted(true);
  }, []);

  console.log("USER RESERVATIONS IN COMPONENT", userReservations);

  const currentDate = new Date();

  const activeReservations = userReservations.filter(reservation => {
    const reservationDate = new Date(reservation.reservationDate.seconds * 1000);
    return isBefore(currentDate, reservationDate) ||
      (currentDate.toDateString() === reservationDate.toDateString() && reservation.reservationTime >= format(currentDate, "HH:mm"));
  }).sort((a, b) => {
    const dateA = new Date(a.reservationDate.seconds * 1000);
    const dateB = new Date(b.reservationDate.seconds * 1000);
    return dateA.getTime() - dateB.getTime() || a.reservationTime.localeCompare(b.reservationTime);
  });

  const completedReservations = userReservations.filter(reservation => {
    const reservationDate = new Date(reservation.reservationDate.seconds * 1000);
    return isBefore(reservationDate, currentDate) ||
      (currentDate.toDateString() === reservationDate.toDateString() && reservation.reservationTime < format(currentDate, "HH:mm"));
  });

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!isDesktop && (
        <MobileTopNavigationBar menuName="My Bookings" />
      )}
      <div className="flex flex-col p-4 lg:p-0">
        <div className="flex flex-col w-full gap-y-3">
          {isDesktop &&
            <div className="flex flex-col mb-2 border-b border-zinc-200 pb-4">
              <span className="text-2xl font-bold">My booking history</span>
            </div>
          }
          <div className="w-full">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <div className="my-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeReservations.length === 0 && (
                      <div className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm p-4 md:col-span-2 lg:col-span-3">
                        <span className="text-gray-500 text-center">
                          You have no active reservations
                        </span>
                      </div>
                    )}
                    {activeReservations.map((reservation) => (
                      <div key={reservation.id} className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm ">
                        <div className="flex flex-row">
                          <div className="flex flex-row w-full justify-between items-center px-4 py-2 border-b">
                            <span className="font-bold text-sm">Date</span>
                            <span className="text-sm">{format(new Date(reservation.reservationDate.seconds * 1000), "dd.MM.yyyy")} - {reservation.reservationTime}</span>
                          </div>
                        </div>
                        <div className="px-4 py-2 w-full">
                          <div className="flex flex-row gap-x-4 w-full">
                            <div className="w-full max-w-20 h-20 relative overflow-hidden rounded-md">
                              <Image src="/images/restaurants/tanuki.png" alt={reservation.table.restaurant.name} className="w-full h-full object-cover" fill priority />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex flex-row justify-between items-center gap-x-2 text-sm">
                                <span className="font-bold">{reservation.table.restaurant.name}</span>
                                <div className="flex flex-row gap-x-2 items-center text-gray-500">
                                  <HalfFullStarIcon className="w-3 h-3" /> <span>4.5</span>
                                </div>
                              </div>
                              <div className="flex flex-row items-center text-sm gap-2">
                                <MapPointIcon className="w-3 h-3 fill-gray-500" />
                                <span className=" text-gray-500">{reservation.table.restaurant.address}</span>
                              </div>
                              <div className="flex flex-row items-center text-sm gap-2">
                                <CuisineIcon className="w-3 h-3 fill-gray-500" />
                                <span className="text-gray-500">Cuisine</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-2 flex gap-2">
                          <ResponsiveDrawerDialog title="Reservation details" triggerButtonText="View details" closeButtonText="Close">
                            <div className="flex flex-col gap-y-5 py-5 text-sm md:text-base">
                              <div className="flex flex-col gap-y-2 border-b pb-5">
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Restaurant</span>
                                  <span className="font-bold">{reservation.table.restaurant.name}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Address</span>
                                  <span className="font-bold">{reservation.table.restaurant.address}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Contact number</span>
                                  <span className="font-bold">{reservation.table.restaurant.contact}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-y-2">
                                <div className="grid grid-cols-2 justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap col-span-1">Reservation id</span>
                                  <span className="font-bold truncate col-span-1">{reservation.id}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Date</span>
                                  <span className="font-bold">{format(new Date(reservation.reservationDate.seconds * 1000), "dd.MM.yyyy")}</span>
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
                                  <span className="text-gray-500 text-nowrap">Reservation status</span>
                                  <span className="font-bold">Active</span>
                                </div>
                              </div>
                            </div>
                          </ResponsiveDrawerDialog>
                          <ResponsiveDrawerDialog
                            open={drawerOpen}
                            setOpen={setDrawerOpen}
                            title="Cancel reservation"
                            triggerButtonText="Cancel"
                            closeButtonText="Close"
                            triggerButtonOption="outlined">
                            <div className="flex flex-col gap-y-5 text-sm md:text-base">
                              <div className="flex flex-col gap-y-2">
                                <span className="font-bold">Are you sure you want to cancel this reservation?</span>
                                <span className="text-gray-500">You can cancel your reservation up to 24 hours before the reservation time.</span>
                              </div>
                              <div className="flex flex-row gap-2">
                                <Button className="w-full" onClick={() => handleConfirmCancel(reservation.id)}>Confirm</Button>
                              </div>
                            </div>
                          </ResponsiveDrawerDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="my-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedReservations.length === 0 && (
                      <div className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm p-4 md:col-span-2 lg:col-span-3">
                        <span className="text-gray-500 text-center">
                          You have no completed reservations
                        </span>
                      </div>
                    )}
                    {completedReservations.map((reservation) => (
                      <div key={reservation.id} className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm ">
                        <div className="flex flex-row">
                          <div className="flex flex-row w-full justify-between items-center px-4 py-2 border-b">
                            <span className="font-bold text-sm">Date</span>
                            <span className="text-sm">{format(new Date(reservation.reservationDate.seconds * 1000), "dd.MM.yyyy")} - {reservation.reservationTime}</span>
                          </div>
                        </div>
                        <div className="px-4 py-2 w-full">
                          <div className="flex flex-row gap-x-4 w-full">
                            <div className="w-full max-w-20 h-20 relative overflow-hidden rounded-md">
                              <Image src="/images/restaurants/tanuki.png" alt={reservation.table.restaurant.name} className="w-full h-full object-cover" fill priority />
                            </div>
                            <div className="flex flex-col w-full">
                              <div className="flex flex-row justify-between items-center gap-x-2 text-sm">
                                <span className="font-bold">{reservation.table.restaurant.name}</span>
                                <div className="flex flex-row gap-x-2 items-center text-gray-500">
                                  <HalfFullStarIcon className="w-3 h-3" /> <span>4.5</span>
                                </div>
                              </div>
                              <div className="flex flex-row items-center text-sm gap-2">
                                <MapPointIcon className="w-3 h-3 fill-gray-500" />
                                <span className=" text-gray-500">{reservation.table.restaurant.address}</span>
                              </div>
                              <div className="flex flex-row items-center text-sm gap-2">
                                <CuisineIcon className="w-3 h-3 fill-gray-500" />
                                <span className="text-gray-500">Cuisine</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-2 flex gap-2">
                          <ResponsiveDrawerDialog title="Reservation details" triggerButtonText="View details" closeButtonText="Close">
                            <div className="flex flex-col gap-y-5 py-5 text-sm md:text-base">
                              <div className="flex flex-col gap-y-2 border-b pb-5">
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Restaurant</span>
                                  <span className="font-bold">{reservation.table.restaurant.name}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Address</span>
                                  <span className="font-bold">{reservation.table.restaurant.address}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Contact number</span>
                                  <span className="font-bold">{reservation.table.restaurant.contact}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-y-2">
                                <div className="grid grid-cols-2 justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap col-span-1">Reservation id</span>
                                  <span className="font-bold truncate col-span-1">{reservation.id}</span>
                                </div>
                                <div className="flex flex-row justify-between items-center gap-x-3">
                                  <span className="text-gray-500 text-nowrap">Date</span>
                                  <span className="font-bold">{format(new Date(reservation.reservationDate.seconds * 1000), "dd.MM.yyyy")}</span>
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
                                  <span className="text-gray-500 text-nowrap">Reservation status</span>
                                  <span className="font-bold">Completed</span>
                                </div>
                              </div>
                            </div>
                          </ResponsiveDrawerDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div >
        </div >
      </div >
    </>
  )
}
