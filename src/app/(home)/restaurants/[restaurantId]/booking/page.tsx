"use client";

import { useEffect, useState } from "react";
import { TableButton, TimeButton } from "./components";
import { getAllReservationsByRestaurantId, getTablesByRestaurantId, makeTableReservation } from "@/lib/api";
import { TRestaurantReservation, TRestaurantTables, times } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/lib/auth-context";
import { Button } from "@/ui/components/button";

export default function TableBooking({ params }: { params: { restaurantId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const restaurantId = params.restaurantId;
  const time = searchParams.get("time");

  const [tables, setTables] = useState<TRestaurantTables[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [reservations, setReservations] = useState<TRestaurantReservation[]>([]);
  const [reservationStatus, setReservationStatus] = useState<string>("");

  useEffect(() => {
    if (time && typeof time === "string") {
      setSelectedTime(decodeURIComponent(time));
    } else {
      setSelectedTime(times[0]);
    }
  }, [time]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getAllReservationsByRestaurantId(restaurantId);
        console.log("RESERVATIONS", response.reservations);
        setReservations(
          response.reservations.map((res: any) => ({
            id: res.id,
            table_id: res.table.id,
            reservation_time: res.reservationTime,
          }))
        );
      } catch (error) {
        console.error("Error fetching reservations: ", error);
      }
    };

    const fetchTables = async () => {
      try {
        const response = await getTablesByRestaurantId(restaurantId);
        console.log("TABLES", response.tables);
        setTables(
          response.tables.map((res: any) => ({
            id: res.id,
            table_number: res.TableNumber,
            number_of_seats: res.NumberOfSeats,
            status: "available", // Initialize status as available
          }))
        );
      } catch (error) {
        console.error("Error fetching tables: ", error);
      }
    };

    fetchReservations();
    fetchTables();
  }, [restaurantId]);

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
    if (userId && selectedTime && selectedTable !== null) {
      const selectedTableId = tables.find(table => table.table_number === selectedTable)?.id;
      if (selectedTableId) {
        const formData = {
          user_id: userId,
          table_id: selectedTableId,
          reservation_time: selectedTime,
        };
        const response = await makeTableReservation(formData);
        if (response.ok === true) {
          setReservationStatus("Reservation successful!");
          // Optionally, refresh reservations to update the UI
          const fetchReservations = async () => {
            try {
              const response = await getAllReservationsByRestaurantId(restaurantId);
              console.log("RESERVATIONS", response.reservations);
              setReservations(
                response.reservations.map((res: any) => ({
                  id: res.id,
                  table_id: res.table.id,
                  reservation_time: res.reservationTime,
                }))
              );
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

  return (
    <div className="min-h-screen w-full flex flex-col py-10 px-4 lg:max-w-6xl lg:p-0 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book a Table</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-4">Time</h2>
        <div className="flex flex-wrap gap-4">
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
        <h2 className="text-xl">Choose Table</h2>
        <div className="flex gap-x-5">
          <div className="flex flex-row gap-x-2">
            <div className="w-5 h-5 rounded-md border border-black flex justify-center items-center"></div>
            <p className="text-sm">Available</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <div className="w-5 h-5 rounded-md border bg-red-200 border-red-400 flex justify-center items-center"></div>
            <p className="text-sm">Reserved</p>
          </div>
          <div className="flex flex-row gap-x-2">
            <div className="w-5 h-5 rounded-md border bg-black border-black flex justify-center items-center"></div>
            <p className="text-sm">Selected</p>
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
      <div className="flex flex-col justify-start gap-y-5 mt-5">
      {reservationStatus && (
        <div className="mt-4 text-center">
          <p>{reservationStatus}</p>
        </div>
      )}
      <Button className="px-4 py-2 rounded-md max-w-64" onClick={handleReservation}>Reserve Table</Button>
      </div>
    </div>
  );
}


// return (
//   <div className="w-full p-4 lg:max-w-6xl lg:p-0 flex flex-col gap-y-6 mx-auto">
//     <p className="text-2xl font-semibold">Book a Table</p>
//     {/* <div>
//       <p>Date</p>
//       <input type="date" placeholder="Choose Date" value={selectedDate} onChange={handleDateChange} min={today} />
//     </div>
//     <div className="flex flex-col gap-y-5">
//       <p>Choose Table</p>
//       <div className="flex flex-wrap justify-between gap-5">
//         {Array.from({ length: 6 }, (_, i) => (
//           <button
//             key={i}
//             className="p-8 bg-white shadow-[0px_2px_8px_0px_#63636333] rounded-lg border border-gray-200 max-w-32 w-full"
//             onClick={() => handleTableClick(`Table ${i + 1}`)}
//           >
//             <p>{`Table ${i + 1}`}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//     <Modal isOpen={isModalOpen} onClose={closeModal}>
//       <p className="text-xl font-semibold">{selectedTable}</p>
//       <p>Details about <span className="text-underline">{selectedTable}</span>.</p>
//     </Modal> */}
//     <div className="flex flex-col gap-y-5">
//       <p>Time</p>
//       <div className="flex flex-wrap gap-5">
//         {times.map((time) => (
//           <button className="py-2 px-4 bg-white rounded-full border border-gray-200 hover:bg-zinc-100/50">
//             <p>{time}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//     <div className="flex flex-col gap-y-5">
//       <p>Choose Table</p>
//       <div className="flex flex-wrap justify-between gap-5">
//         {Array.from({ length: 6 }, (_, i) => (
//           <button
//             key={i}
//             className={
//               clsx(
//                 "p-8 bg-white rounded-lg border border-gray-300 max-w-32 w-full hover:bg-zinc-100/50 transition duration-200 ease-in-out",
//                 selectedTable === `${i + 1}` && "bg-green-100 border-green-500 hover:bg-green-100"
//               )
//             }
//             onClick={() => handleTableClick(`${i + 1}`)}
//           >
//             <p>{`Table ${i + 1}`}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//   </div >
// );