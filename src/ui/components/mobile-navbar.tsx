"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BellIcon, BookingsIcon, HalfFullHeartIcon, HomeIcon, LongRightArrowIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";
import PopoverMenu from "./popover-menu";
import useAuth from "@/lib/auth-context";
import { TUser } from "@/lib/types";

export default function MobileNavBar() {
  const pathname = usePathname();
  const { isAuth, isLoading, userId } = useAuth();

  // const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // const togglePopover = () => {
  //   setIsPopoverOpen((prev) => !prev);
  // };

  // const closePopover = () => {
  //   setIsPopoverOpen(false);
  // };

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
            {isLoading &&
              <div className="animate-pulse flex justify-center">
                <div className="w-full h-[61px]"></div>
              </div>
            }
            {!isLoading &&
              <>
                <Link href={isAuth ? `/users/${userId}/wishlist` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/wishlist") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <HalfFullHeartIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">Wishlist</span>
                  </div>
                </Link>
                <Link href={isAuth ? `/users/${userId}/bookings` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/bookings") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <BookingsIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">My Bookings</span>
                  </div>
                </Link>
                <Link href="/" className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname === "/" && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <HomeIcon className="w-8 h-8" />
                    {/* <span className="text-[11px] mt-1">Home</span> */}
                  </div>
                </Link>
                <Link href={isAuth ? `/users/${userId}/notifications` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/notifications") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <BellIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">Notifications</span>
                  </div>
                </Link>
                <Link href={isAuth ? `/users/${userId}/settings` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/settings") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <UserIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">My Profile</span>
                  </div>
                </Link>
              </>}
            {/* <div className="active:bg-gray-200/30 cursor-pointer flex justify-center" onClick={togglePopover}>
              <div className="relative pt-3 pb-1 flex flex-col items-center">
                {pathname === "/user" && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                <MenuIcon className="w-5 h-5" />
                <span className="text-[11px] mt-1">Menu</span>
              </div>
            </div> */}
            {/* <PopoverMenu isOpen={isPopoverOpen} onClose={closePopover}>
              {isAuth ?
                <div className="flex flex-row w-full">
                  <Link href="/user" className="px-4 rounded-md transition duration-300 hover:bg-gray-100">
                    <div className="relative flex flex-row items-center w-full gap-x-2">
                      <UserIcon className="w-5 h-5 stroke-gray-500" />
                      <div className="flex flex-col gap-y-1">
                        <span className="text-sm">Username</span>
                        <span className="flex flex-row gap-x-2 text-xs text-gray-500 items-center">
                          My profile
                          <LongRightArrowIcon className="w-4 h-4 stroke-gray-500" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div> :
                <Link href="/sign-in" className="flex flex-row items-center justify-center gap-x-2 rounded-lg py-2 px-4 bg-black text-white text-sm transition active:shadow-[0px_0px_5px_0px_#333333]">
                  <svg className="stroke-white w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.00098 11.999L16.001 11.999M16.001 11.999L12.501 8.99902M16.001 11.999L12.501 14.999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Sign in | Sign up
                </Link>
              }
            </PopoverMenu> */}
          </div>
        </div>
      </nav>
    </>
  )
}
