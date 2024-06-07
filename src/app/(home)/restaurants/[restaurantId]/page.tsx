"use client";

import { CuisineIcon, HalfFullStarIcon, MapPointIcon } from "@/ui/custom-components/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import AboutSection from "./(sections)/about-section";
import ReviewsSection from "./(sections)/reviews-section";
import GallerySection from "./(sections)/gallery-section";
import MenuSection from "./(sections)/menu-section";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { useEffect, useState } from "react";
import { getRestaurantById } from "@/lib/api";
import { TRestaurant, times } from "@/lib/types";
import useAuth from "@/lib/hooks/use-auth";
import MobileTopNavigationBar from "@/ui/custom-components/mobile-top-navigation-bar";

export default function RestaurantPage({ params }: { params: { restaurantId: string } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectURL = `${process.env.NEXT_PUBLIC_DEV_URL}${pathname}/booking`;
  const { auth, isLoading } = useAuth();
  const section = searchParams.get("section") || "about";
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [restaurant, setRestaurant] = useState<TRestaurant>({
    id: "",
    name: "",
    address: "",
    contact: "",
  });
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>(times[0]);

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  useEffect(() => {
    const getRestaurant = async () => {
      const response = await getRestaurantById(params.restaurantId);
      if (response) {
        setRestaurant(response);
      }
    }

    getRestaurant();
  }, [params.restaurantId]);

  const renderSection = () => {
    switch (section) {
      case "menu":
        return <MenuSection />;
      case "gallery":
        return <GallerySection />;
      case "reviews":
        return <ReviewsSection />;
      case "about":
      default:
        return <AboutSection restaurant={restaurant} />;
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* {!isDesktop && (
        <MobileTopNavigationBar className="bg-transparent"/>
      )} */}
      <div className="relative w-full h-96">
        {
          restaurant.image_urls ? (
            <Image src={`${restaurant.image_urls[0]}`} alt="Restaurant" className="w-full h-full object-cover" fill priority placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcuAIAAhABW1l4PkwAAAAASUVORK5CYII=" />
          ) : (
            <div className="min-w-md min-h-md min-h-96 bg-gray-200"></div>
          )
        }
        {/* <Image className="w-full h-full object-cover" src="https://reservista-main-bucket.s3.amazonaws.com/gumball%27s%20living%20room.jpg" alt="restaurant" fill /> */}
      </div>
      <div className="grid grid-cols-1 w-full lg:grid-cols-3 lg:gap-4 lg:w-[95%] mx-auto">
        <div className="relative w-full col-span-1 rounded-t-xl bg-white lg:w-full mt-[-80px] mx-auto lg:col-span-2 lg:shadow-[0px_0px_10px_0px_#0000001A]">
          <div className="py-6 px-6">
            <div className="flex flex-row justify-between items-center w-full">
              <p className="font-bold text-2xl">{restaurant.name}</p>
              <div className="flex flex-row items-end gap-x-1">
                <HalfFullStarIcon className="w-4 h-4" />
                <p className="text-sm leading-none">4.5</p>
                <p className="text-[11px] leading-none text-black/50">9.9k</p>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <CuisineIcon className="w-4 h-4 fill-zinc-500" />
              <p className="text-sm ml-1">Italian</p>
            </div>
            <div className="flex flex-row items-center mt-1">
              <MapPointIcon className="w-4 h-4 fill-gray-500" />
              <p className="text-sm ml-1 truncate">{restaurant.address}</p>
            </div>
          </div>
          <nav className="mt-3 shadow-[inset_0_-1px_0_0_#e5e5e5] w-full text-sm">
            <div className="flex justify-between items-center px-6 overflow-x-auto">
              {/* <div>
              <Link href="/restaurants/[restaurantId]" as={`/restaurants/${params.restaurantId}`} className={`block font-bold pb-2 px-4 
              ${pathname === `/restaurants/${params.restaurantId}`
                  ? `text-black`
                  : `text-[--gray-color]`} `}>
                ABOUT
              </Link>
              <div className="w-full h-[2px] bg-black rounded-2xl"></div>
            </div> */}
              <Link href="/restaurants/[restaurantId]?section=about" as={`/restaurants/${params.restaurantId}?section=about`} className={`relative font-bold pb-2 px-4 
              ${pathname === `/restaurants/${params.restaurantId}` && section === "about"
                  ? `after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:absolute after:bottom-0 after:left-0 after:transition after:duration-300 after:ease-in-out after:rounded-t-full after:opacity-100 text-black`
                  : `text-[--gray-color]`} after:content-[''] after:opacity-0`}>
                ABOUT
              </Link>
              <Link href="/restaurants/[restaurantId]?section=gallery" as={`/restaurants/${params.restaurantId}/?section=gallery`} className={`relative font-bold pb-2 px-4 
              ${pathname === `/restaurants/${params.restaurantId}` && section === "gallery"
                  ? `after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:absolute after:bottom-0 after:left-0 after:transition after:duration-300 after:ease-in-out after:rounded-t-full after:opacity-100 text-black`
                  : `text-[--gray-color]`} after:content-[''] after:opacity-0`}>
                GALLERY
              </Link>
              <Link href="/restaurants/[restaurantId]?section=reviews" as={`/restaurants/${params.restaurantId}/?section=reviews`} className={`relative font-bold pb-2 px-4 
              ${pathname === `/restaurants/${params.restaurantId}` && section === "reviews"
                  ? `after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:absolute after:bottom-0 after:left-0 after:transition after:duration-300 after:ease-in-out after:rounded-t-full after:opacity-100 text-black`
                  : `text-[--gray-color]`} after:content-[''] after:opacity-0`}>
                REVIEWS
              </Link>
              <Link href="/restaurants/[restaurantId]?section=menu" as={`/restaurants/${params.restaurantId}/?section=menu`} className={`relative font-bold pb-2 px-4 
              ${pathname === `/restaurants/${params.restaurantId}` && section === "menu"
                  ? `after:content-[''] after:block after:w-full after:h-[2px] after:bg-black after:absolute after:bottom-0 after:left-0 after:transition after:duration-300 after:ease-in-out after:rounded-t-full after:opacity-100 text-black`
                  : `text-[--gray-color]`} after:content-[''] after:opacity-0`}>
                MENU
              </Link>
            </div>
          </nav>
          <div className="pb-40 w-full">
            <div className="px-6 py-6 text-sm">
              {renderSection()}
            </div>
          </div>
        </div>

        {isDesktop &&
          <div className="sticky lg:grid-cols-1 mt-[-80px]">
            <div className="flex flex-col gap-y-4">
              <div className="bg-white rounded-xl shadow-[0px_0px_10px_0px_#0000001A] p-6 text-sm">
                <div className="flex justify-center border-b pb-4">
                  <p className="text-base font-bold">Book a Table</p>
                </div>
                <div className="flex flex-row gap-x-2 justify-between items-center py-4 border-b text-base">
                  <p>Date:</p>
                  <span className="font-bold">Today</span>
                </div>
                <div className="flex flex-row gap-x-2 justify-between items-center py-4 text-base">
                  <p>Time:</p>
                  <select className="font-bold border py-1 px-2 rounded-lg" value={selectedTime} onChange={handleTimeChange}
                  >
                    {times.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                {
                  !isLoading && (
                    <div className="flex justify-center py-4">
                      {
                        auth.isAuth ?
                          (auth.user_roles && auth.user_roles.includes("activated") ? (
                            <Link href={`/restaurants/${params.restaurantId}/booking?time=${encodeURIComponent(selectedTime)}`} className="w-full bg-black text-white text-center py-2 rounded-full shadow-lg">Book a Table</Link>
                          ) : (
                            <Link href={`${process.env.NEXT_PUBLIC_DEV_URL}/activate`} className="w-full bg-black text-white text-center py-2 rounded-full shadow-lg">Activate account</Link>
                          )) : (
                            <Link href={`/sign-in?redirect=${encodeURIComponent(redirectURL)}`} className="w-full bg-black text-white text-center py-2 rounded-full shadow-lg">Login to Book</Link>
                          )
                      }
                      {/* <Link href={`/restaurants/${params.restaurantId}/booking?time=${encodeURIComponent(selectedTime)}`} className="w-full bg-black text-white text-center py-2 rounded-full shadow-lg">Book a Table</Link> */}
                    </div>)
                }

              </div>
            </div>
          </div>
        }

        {!isDesktop &&
          <div className="sticky bottom-20 w-full">
            <div className="flex flex-row justify-center w-full">
              {
                auth.isAuth ? (
                  <Link href={`/restaurants/${params.restaurantId}/booking?time=${encodeURIComponent(selectedTime)}`} className="w-64 bg-black text-sm text-white text-center py-2 rounded-full shadow-lg">Book a Table</Link>
                ) : (
                  <Link href={`/sign-in?redirect=${encodeURIComponent(redirectURL)}`} className="w-64 bg-black text-white text-center py-2 rounded-full shadow-lg">Login to Book</Link>
                )
              }
              {/* <Link href="/restaurants/[restaurantId]/booking" as={`/restaurants/${params.restaurantId}/booking`} className="w-64 bg-black text-white text-center py-2 rounded-full shadow-lg">Book a Table</Link> */}
            </div>
          </div>
        }
      </div>
    </>
  )
}


const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:w-[95%] mx-auto mt-6 animate-pulse">
      <div className="relative rounded-t-xl bg-gray-200 lg:w-full mt-[-80px] mx-auto lg:col-span-2 lg:shadow-[0px_0px_10px_0px_#0000001A]">
        <div className="py-6 px-6">
          <div className="flex flex-row justify-between items-center w-full mb-4">
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="flex flex-row items-end gap-x-1">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-6"></div>
              <div className="h-4 bg-gray-300 rounded w-8"></div>
            </div>
          </div>
          <div className="flex flex-row items-center mb-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 ml-2"></div>
          </div>
          <div className="flex flex-row items-center mt-1">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 ml-2"></div>
          </div>
        </div>
        <nav className="mt-3 shadow-[inset_0_-1px_0_0_#e5e5e5] w-full text-sm">
          <div className="flex justify-between items-center px-6 overflow-x-auto">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          </div>
        </nav>
        <div className="pb-40">
          <div className="px-6 py-6 text-sm">
            <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};