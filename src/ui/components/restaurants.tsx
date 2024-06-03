"use client";

import Image from "next/image";
import Link from "next/link";
import useAuth from "@/lib/hooks/use-auth";
import { useEffect, useState } from "react";
import { Auth, FetchState, TAPIRestaurantReponse, TRestaurant } from "@/lib/types";
import { getAllRestaurants } from "@/lib/api";
import { CuisineIcon, HalfFullStarIcon, MapPointIcon } from "./icons";
import { ResponsiveDrawerDialog } from "./responsive-drawer-dialog";

export default function RestuarantCardtWrapper({ className }: { className?: string }) {
  const { auth, isLoading } = useAuth();
  const [restaurants, setRestaurants] = useState<TRestaurant[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [isMounted, setIsMounted] = useState(false);
  const [fetchError, setFetchError] = useState<string | undefined>("");

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      setFetchState("loading");

      const reponse: TAPIRestaurantReponse = await getAllRestaurants();
      if (reponse.status === 200) {
        setRestaurants(reponse.data);
        setFetchState("success");
      } else {
        setFetchState("error");
        setFetchError(reponse?.message);
      }
    };

    setIsMounted(true);
    if (!isLoading) {
      fetchAllRestaurants();
    }
  }, [auth.isAuth, auth.user_roles, isLoading]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 gap-y-5 md:p-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:p-0 lg:gap-y-8 ${className}`}>
      {fetchState === "loading" &&
        <>
          {Array.from({ length: 12 }, (_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </>
      }
      {fetchState === "error" && <p>{fetchError}</p>}
      {fetchState === "success" && restaurants.map((restaurant) => <NewRestaurantCard key={restaurant.id} restaurant={restaurant} auth={auth} isLoading={isLoading} />)}

    </div>
  )
}

export function NewRestaurantCard({ restaurant, auth, isLoading }: { restaurant: TRestaurant, auth: Auth, isLoading: boolean }) {
  return (
    <div className="flex flex-col rounded-xl shadow-[0px_2px_8px_0px_#63636333]">
      <div className="relative w-full h-[150px] max-w-full rounded-t-xl overflow-hidden md:h-[200px]">
        <Link href={`restaurants/${restaurant.id}`}>
          {
            restaurant.image_urls ? (
              <Image src={`${restaurant.image_urls[0]}`} alt="Restaurant" className="w-full h-full object-cover" fill priority placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcuAIAAhABW1l4PkwAAAAASUVORK5CYII=" />
            ) : (
              <Image src="/images/restaurants/tanuki.png" alt="Restaurant" className="w-full h-full object-cover" fill priority />
            )
          }
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
            <MapPointIcon className="w-4 h-4 fill-gray-500"/>
            <p className="ml-1 text-sm truncate">{restaurant.address}</p>
          </div>
        </Link>
        <div className="mt-5">
          {isLoading ? (
            <div className="w-full h-10 bg-zinc-200 rounded-md animate-pulse"></div>
          ) : auth.isAuth && !auth.user_roles?.includes("activated") ? (
            <ResponsiveDrawerDialog title="Activate account" triggerButtonText="Book" closeButtonText="Cancel">
              <div className="flex flex-col gap-y-5">
                <span>
                  Please activate your account to book a table.
                </span>
                <Link href="http://localhost:3000/activate" className="w-full rounded-lg p-2 flex justify-center text-sm bg-black border border-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333]">Activate Account</Link>
              </div>
            </ResponsiveDrawerDialog>
          ) : auth.isAuth ? (
            <Link href={`restaurants/${restaurant.id}/booking`} className="w-full rounded-lg p-2 flex justify-center text-sm bg-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333]">Book</Link>
          ) : (
            <ResponsiveDrawerDialog title="Sign in" triggerButtonText="Book" closeButtonText="Cancel">
              <div className="flex flex-col gap-y-5">
                <span>
                  Please sign in to your account to book a table.
                </span>
                <Link href="http://localhost:3000/sign-in" className="w-full rounded-lg p-2 flex justify-center text-sm bg-black border border-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333]">Sign in</Link>
              </div>
            </ResponsiveDrawerDialog>
          )
          }

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
