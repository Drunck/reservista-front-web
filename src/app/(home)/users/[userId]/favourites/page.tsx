"use client";

import { useEffect, useState } from "react";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { CuisineIcon, HalfFullStarIcon, MapPointIcon } from "@/ui/custom-components/icons";
import MobileTopNavigationBar from "@/ui/custom-components/mobile-top-navigation-bar";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "lucide-react";
import { TRestaurant } from "@/lib/types";

export default function UserFavouritesPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [wishlist, setWishlist] = useState<TRestaurant[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("favourites") || "[]");
    setWishlist(storedWishlist);
    setIsMounted(true);
  }, []);

  const handleRemoveFromWishlist = (restaurantId: string) => {
    const updatedWishlist = wishlist.filter((restaurant) => restaurant.id !== restaurantId);
    localStorage.setItem("favourites", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!isDesktop && (
        <MobileTopNavigationBar menuName="My favourites" />
      )}
      <div className="p-4 lg:p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.length === 0 ? (
            <div className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm p-4 md:col-span-2 lg:col-span-3">
              <span className="text-gray-500 text-center">
                You have no favourites yet.
              </span>
            </div>
          ) : (
            wishlist.map((restaurant) => (
              <div key={restaurant.id} className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden ">
                <div className="relative flex">
                  <Link href={`/restaurants/${restaurant.id}`} className="w-full h-full">
                    <div className="relative w-full h-[150px] max-w-full rounded-t-lg md:h-[200px]">
                      {restaurant.image_urls ? (
                        <Image
                          src={restaurant.image_urls[0].toString()}
                          alt="Restaurant"
                          className="w-full h-full object-cover"
                          fill
                          priority
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcuAIAAhABW1l4PkwAAAAASUVORK5CYII="
                        />
                      ) : (
                        <div className="w-full h-full object-cover bg-gray-200"></div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(restaurant.id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full group"
                  >
                    <HeartIcon className="w-4 h-4 fill-black" />
                  </button>
                </div>
                <div className="px-4 py-2 md:text-sm">
                  <Link href={`/restaurants/${restaurant.id}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-md font-semibold">{restaurant.name}</h3>
                      <div className="flex flex-row items-center">
                        <HalfFullStarIcon className="w-4 h-4 mr-1" />
                        <p className="text-sm">4.5</p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <CuisineIcon className="w-4 h-4 fill-zinc-500" />
                      <p className="ml-1 text-sm">{restaurant.restaurant_cuisine}</p>
                    </div>
                    <div className="flex flex-row items-center mt-1">
                      <MapPointIcon className="w-4 h-4 fill-gray-500" />
                      <p className="ml-1 text-sm truncate">{restaurant.address}</p>
                    </div>
                  </Link>
                  <div className="mt-5">
                    <Link
                      href={`/restaurants/${restaurant.id}/booking`}
                      className="w-full rounded-md p-2 flex justify-center text-sm bg-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333]"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

{/* <div className="col-span-1 flex flex-col bg-white rounded-lg border shadow-sm ">
            <div className="px-4 py-2 w-full">
              <div className="flex flex-row gap-x-4 w-full">
                <div className="w-full max-w-20 h-20 relative overflow-hidden rounded-md">
                  <div className="min-w-md min-h-96 bg-gray-200"></div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-row justify-between items-center gap-x-2 text-sm">
                    <span className="font-bold">Restaurant name</span>
                    <div className="flex flex-row gap-x-2 items-center text-gray-500">
                      <HalfFullStarIcon className="w-3 h-3" /> <span>4.5</span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center text-sm gap-2">
                    <MapPointIcon className="w-3 h-3 fill-gray-500" />
                    <span className=" text-gray-500">Restaurant address</span>
                  </div>
                  <div className="flex flex-row items-center text-sm gap-2">
                    <CuisineIcon className="w-3 h-3 fill-gray-500" />
                    <span className="text-gray-500">Cuisine</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}