"use client";

import Image from "next/image";
import Link from "next/link";
import useAuth from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { FetchState, Restaurant } from "@/lib/types";
import { getAllRestaurants } from "@/lib/api";
import { CuisineIcon, HalfFullStarIcon, LoadingIcon, MapPointIcon } from "./icons";

export default function RestuarantCardtWrapper({className}: {className?: string}) {
  const { isAuth, user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("loading");

  const restaurant = {
    id: "1",
    name: "Crepe Cafe",
    address: "1234, Some Street, Some City",
    cuisine: "Italian",
    image: "/images/restaurants/crepecafe.png",
  }

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        setFetchState("loading");
        const restaurants = await getAllRestaurants();
        if (restaurants.length > 0) {
          setRestaurants(restaurants);
          setFetchState("success");
        } else {
          console.error("Failed to fetch restaurants", restaurants);
          setFetchState("error");
        }
      } catch (error) {
        console.error("Error fetching restaurants: ", error);
        setFetchState("error");
      }
    };
    if (user === undefined) {
      user
    }
    fetchAllRestaurants();
  }, []);

  return (
    <div className={`p-4 grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:p-0 lg:gap-y-8 ${className}`}>
      {fetchState === "loading" &&
        <>
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
          <RestaurantCardSkeleton />
        </>
      }
      {fetchState === "error" && <p>Failed to fetch restaurants</p>}
      {fetchState === "success" && restaurants.map((restaurant) => <NewRestaurantCard key={restaurant.id} restaurant={restaurant} isAuth={isAuth} userId={user?.user_id} />)}

    </div>
  )
}

export function RestaurantCard({ restaurant, isAuth }: { restaurant: Restaurant, isAuth: boolean }) {
  return (
    <div className="flex flex-row p-3 rounded-md shadow-[0px_2px_8px_0px_#63636333]">
      <div className="relative w-full h-[65px] max-w-[65px] rounded-md overflow-hidden">
        <Image src="/images/restaurants/crepecafe.png" alt="Restaurant" className="w-full h-full object-cover" fill priority />
      </div>
      <div className="grid grid-cols-3 gap-4 relative pl-4">
        <div className="col-span-2">
          <h3 className="text-md font-semibold">{restaurant.name}</h3>
          <div className="relative flex flex-row items-center">
            <MapPointIcon className="mr-1" />
            <Image src="/icons/map-point.svg" alt="Location" width={17} height={17} className="absolute -left-0.5" />
            <p className="text-xs ml-4 truncate">{restaurant.address}</p>
          </div>
          <p className="text-xs">Cuisine</p>
        </div>
        {isAuth &&
          <div className="relative col-span-1">
            <Link href={`restaurants/${restaurant.id}`} className="absolute bottom-0 w-full rounded-lg p-1.5 flex justify-center text-xs bg-black text-white hover:bg-gray-900 transition active:shadow-[0px_0px_5px_0px_#333333]">Book</Link>
          </div>
        }
      </div>
    </div>
  )
}


export function NewRestaurantCard({ restaurant, isAuth, userId }: { restaurant: Restaurant, isAuth: boolean, userId: string | undefined }) {
  return (
    <div className="flex flex-col rounded-xl shadow-[0px_2px_8px_0px_#63636333]">
      <div className="relative w-full h-[150px] max-w-full rounded-t-xl overflow-hidden md:h-[200px]">
        <Link href={`restaurants/${restaurant.id}`}>
          <Image src="/images/restaurants/crepecafe.png" alt="Restaurant" className="w-full h-full object-cover" fill priority />
        </Link>
        <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md">
          <Image src="/icons/heart-not-filled.svg" alt="Favorite" width={17} height={17} />
        </button>
      </div>
      <div className="px-4 py-2 md:text-sm">
        <Link href={`restaurants/${restaurant.id}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold">{restaurant.name}</h3>
            <div className="flex flex-row items-center">
              <HalfFullStarIcon className="w-4 h-4 mr-1" />
              <p className="text-sm">4.5</p>
            </div>
          </div>
          <div className="flex flex-row items-center">
            <CuisineIcon className="w-4 h-4 fill-zinc-500" />
            <p className="ml-1 text-sm">Italian</p>
          </div>
          <div className="flex flex-row items-center mt-1">
            <MapPointIcon className="w-4 h-4" strokeFill="fill-zinc-500" />
            <p className="ml-1 text-sm truncate">{restaurant.address}</p>
          </div>
        </Link>
        <div className="mt-5">
          <Link href={isAuth ? `restaurants/${restaurant.id}/booking` : "/sign-in"} className="w-full rounded-lg p-2 flex justify-center text-sm bg-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333]">Book</Link>
        </div>
      </div>
    </div>
  )
}

const RestaurantCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl shadow-[0px_2px_8px_0px_#63636333] animate-pulse">
      <div className="relative w-full h-[150px] max-w-full rounded-t-xl overflow-hidden bg-zinc-200 md:h-[200px]"></div>
      <div className="px-4 py-2 md:text-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
          <div className="flex flex-row items-center">
            <div className="h-3 bg-zinc-200 rounded w-8"></div>
          </div>
        </div>
        <div className="flex flex-row items-center mt-2">
          <div className="h-3 bg-zinc-200 rounded w-1/4"></div>
        </div>
        <div className="flex flex-row items-center mt-2">
          <div className="h-3 bg-zinc-200 rounded w-3/4"></div>
        </div>
        <div className="mt-5">
          <div className="w-full h-10 bg-zinc-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const NewRestaurantCardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl shadow-[0px_2px_8px_0px_#63636333] relative overflow-hidden">
      <div className="relative w-full h-[150px] max-w-full rounded-t-xl overflow-hidden bg-[#78788029] md:h-[200px]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#78788029]">
          <div className="skeleton-line"></div>
        </div>
      </div>
      <div className="px-4 py-2 md:text-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-[#78788029] rounded w-3/4 relative overflow-hidden">
            <div className="skeleton-line"></div>
          </div>
          <div className="flex flex-row items-center">
            <div className="w-4 h-4 bg-[#78788029] rounded-full mr-1 relative overflow-hidden">
              <div className="skeleton-line"></div>
            </div>
            <div className="h-3 bg-[#78788029] rounded w-8 relative overflow-hidden">
              <div className="skeleton-line"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center mt-1">
          <div className="w-4 h-4 bg-[#78788029] rounded-full relative overflow-hidden">
            <div className="skeleton-line"></div>
          </div>
          <div className="ml-1 h-3 bg-[#78788029] rounded w-1/4 relative overflow-hidden">
            <div className="skeleton-line"></div>
          </div>
        </div>
        <div className="flex flex-row items-center mt-1">
          <div className="w-4 h-4 bg-[#78788029] rounded-full relative overflow-hidden">
            <div className="skeleton-line"></div>
          </div>
          <div className="ml-1 h-3 bg-[#78788029] rounded w-3/4 relative overflow-hidden">
            <div className="skeleton-line"></div>
          </div>
        </div>
        <div className="mt-5">
          <div className="w-full h-10 bg-[#78788029] rounded-lg relative overflow-hidden">
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};