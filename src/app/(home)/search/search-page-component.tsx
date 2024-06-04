"use client";

import { getAllRestaurants } from "@/lib/api";
import useAuth from "@/lib/hooks/use-auth";
import { FetchState, TAPIRestaurantResponse, TRestaurant } from "@/lib/types";
import { RestaurantCardSkeleton, NewRestaurantCard } from "@/ui/components/restaurants";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchPageComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search_query")?.toString();
  
  const { auth, isLoading } = useAuth();
  const [restaurants, setRestaurants] = useState<TRestaurant[]>([]);
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [isMounted, setIsMounted] = useState(false);
  const [fetchError, setFetchError] = useState<string | undefined>("");

  const searchRestaurants = async (search: string) => {
    setFetchState("loading");

    const response: TAPIRestaurantResponse = await getAllRestaurants({q: search});
    if (response.status === 200 && response.restaurants) {
      setRestaurants(response.restaurants);
      setFetchState("success");
    } else {
      setFetchState("error");
      setFetchError(response?.message);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (!isLoading && query !== undefined) {
      searchRestaurants(query);
    }
  }, [isLoading, query]);

  if (!isMounted) {
    return null;
  } 

  if (!query) {
    return (
      <div className="grid grid-cols-1 py-14 gap-y-5 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:p-0 lg:gap-y-8">
        <p className="text-center text-xl">We couldn&apos;t find anything</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-y-5 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:p-0 lg:gap-y-8">
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
