"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, BookingsIcon, HalfFullHeartIcon, HomeIcon, SearchIcon, UserIcon } from "./icons";
import useAuth from "@/lib/hooks/use-auth";
import { MobilePopupSideBar } from "./mobile-sidebar";
import { useEffect, useState } from "react";
import { TUser } from "@/lib/types";

export default function MobileNavBar() {
  const pathname = usePathname();
  const { auth, isLoading } = useAuth();

  const [user, setUser] = useState<TUser | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/users/view/id/${auth.user_id} `, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      } finally {
        return;
      }
    };
    if (auth.isAuth) getUser();
  }, [auth.isAuth, auth.user_id]);

  return (
    <>
      {pathname === "/" && (
        <div className="py-2 px-4 w-full fixed z-10 bg-white shadow-md rounded-b-md lg:hidden">
          <div className="relative w-full">
            <form>
              <label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="w-5 h-5 stroke-gray-500" />
                </span>
                <input className="w-full min-w-full py-1.5 px-4 pl-11 text-sm transition rounded-lg border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 focus:ring-gray-200 focus:ring-[4px]" type="text" placeholder="Location, Restaurant, or Cuisine" />
              </label>
            </form>
          </div>
        </div>)
      }
      <nav className="flex lg:hidden items-center justify-between flex-col w-full fixed inset-x-0 bottom-0 z-10 bg-white shadow-[0px_0px_5px_0px_#d5d5d5] ">
        <div className="w-full">
          <div className="grid grid-cols-5 px-4 border-t">
            {isLoading ?
              <div className="animate-pulse flex justify-center items-center col-span-5">
                <div className="w-full h-[57px]"></div>
              </div>
              :
              <>
                <Link href={auth.isAuth ? `/users/${auth.user_id}/wishlist` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/wishlist") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <HalfFullHeartIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">Wishlist</span>
                  </div>
                </Link>
                <Link href={auth.isAuth ? `/users/${auth.user_id}/bookings` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/bookings") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <BookingsIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">My bookings</span>
                  </div>
                </Link>
                <Link href="/" className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname === "/" && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <HomeIcon className="w-8 h-8" />
                    {/* <span className="text-[11px] mt-1">Home</span> */}
                  </div>
                </Link>
                <Link href={auth.isAuth ? `/users/${auth.user_id}/notifications` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/notifications") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <BellIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">Notifications</span>
                  </div>
                </Link>
                <Link href={auth.isAuth ? `/users/${auth.user_id}` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname === `/users/${auth.user_id}` && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <UserIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">My profile</span>
                  </div>
                </Link>
                {/* <MobilePopupSideBar isMounted={isLoading} user={user} userId={auth.user_id || ""} /> */}
              </>}
          </div>
        </div>
      </nav>
    </>
  )
}
