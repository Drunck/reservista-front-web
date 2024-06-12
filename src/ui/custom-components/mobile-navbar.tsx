"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BellIcon, BookingsIcon, HalfFullHeartIcon, HomeIcon, LongRightArrowIcon, SearchIcon, UserIcon } from "./icons";
import useAuth from "@/lib/hooks/use-auth";
import { useEffect, useState } from "react";
import { TUser } from "@/lib/types";
import SearchInput from "./search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function MobileNavBar() {
  const pathname = usePathname();
  const router = useRouter();
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
      {pathname === "/" || pathname === "/search" || pathname.includes("/page/") ? (
        <div className="py-2 px-4 w-full fixed z-50 bg-white shadow-md rounded-b-md lg:hidden">
          {
            pathname === "/search" && (
              <div className="absolute border border-gray-200 rounded-full p-2 hover:cursor-pointer hover:bg-gray-100/50 active:bg-gray-100/50" onClick={() => router.back()} >
                <LongRightArrowIcon className="w-5 h-5 stroke-gray-600 rotate-180" />
              </div>
            )
          }
          <div className="relative w-full">
            <SearchInput />
          </div>
        </div>) : null
      }
      <nav className="flex lg:hidden items-center justify-between flex-col w-full fixed inset-x-0 bottom-0 z-50 bg-white shadow-[0px_0px_5px_0px_#d5d5d5] ">
        <div className="w-full">
          <div className="grid grid-cols-5 px-4 border-t">
            {isLoading ?
              <div className="animate-pulse flex justify-center items-center col-span-5">
                <div className="w-full h-[57px]"></div>
              </div>
              :
              <>
                <Link href={auth.isAuth ? `/users/${auth.user_id}/favourites` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/favourites") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <HalfFullHeartIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">Favourites</span>
                  </div>
                </Link>
                <Link href={auth.isAuth ? `/users/${auth.user_id}/bookings` : "/sign-in"} className="active:bg-gray-200/30 flex justify-center">
                  <div className="relative pt-3 pb-1 flex flex-col items-center">
                    {pathname.includes("/bookings") && <span className="w-4 h-2 absolute bg-black rounded-b-lg top-0"></span>}
                    <BookingsIcon className="w-5 h-5" />
                    <span className="text-[11px] mt-1">Bookings</span>
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
                    {
                      auth.isAuth ? (
                        <Avatar className="w-5 h-5">
                          <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
                          <AvatarFallback>
                            <User className="w-1/2 h-1/2" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )
                    }
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
