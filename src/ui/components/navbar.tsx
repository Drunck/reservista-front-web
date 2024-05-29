"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kumbh_sans } from "../fonts";
import useAuth from "@/lib/auth-context";
import { BookingsIcon, LoginIcon, SearchIcon } from "./icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { TUser } from "@/lib/types";

export default function NavBar() {
  const { isAuth, isLoading, userId } = useAuth();
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const getUser = async () => {

      if (isAuth) {
        try {
          setIsMounted(false);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/users/view/id/${userId} `, {
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
          setIsMounted(true);
          return;
        }
      }
    };
    getUser();
  }, [isAuth, userId]);

  return (
    <div className="hidden lg:block lg:fixed w-screen shadow-md top-0 z-10 bg-white">
      <nav className="relative w-full max-w-6xl m-auto flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center py-2">
            <Link href="/" className={`${kumbh_sans.className} font-bold text-4xl`}>reservista</Link>
          </div>
        </div>
        <div className="absolute mx-auto left-0 right-0 py-4 w-full max-w-lg text-md">
          <div className="relative w-full">
            <form>
              <label>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="w-5 h-5 stroke-gray-500" />
                </span>
                <input className="w-full min-w-full py-1.5 px-4 pl-11 transition rounded-lg border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 focus:ring-gray-200 focus:ring-[4px]" type="text" placeholder="Location, Restaurant, or Cuisine" />
              </label>
            </form>
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-3 text-nowrap">
          {isAuth && !isLoading && isMounted ?
            <UserDropdownMenu user={user} userId={userId} />
            :
            <Link href="/sign-in" className="flex flex-row items-center gap-x-2 rounded-lg py-2 px-4 bg-black text-white text-sm hover:bg-[--dark-blue-1] transition active:shadow-[0px_0px_5px_0px_#333333]">
              <LoginIcon className="w-5 h-5 stroke-white" />
              Sign in
            </Link>
          }

          {/* {isAuth ?
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
            </Link> :
            <>
              <Link href="/sign-in" className="py-2 px-4 text-md hover:underline">
                Sign in
              </Link>
              <Link href="/sign-up" className="flex flex-row items-center gap-x-2 py-2 px-4 text-sm rounded-lg bg-black text-white hover:bg-[#293241] transition active:shadow-[0px_0px_5px_0px_#333333]">
                <LoginIcon className="w-5 h-5 stroke-white" />
                Sign up
              </Link>
            </>
          } */}
        </div>
      </nav>
    </div>
  )
}


export function UserDropdownMenu({ user, userId }: { user: TUser | undefined, userId: string | undefined }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { setIsAuth } = useAuth();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setIsAuth(false);
        router.push("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setLoggingOut(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
          <AvatarFallback>
            <User className="w-1/2 h-1/2" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-3">
        <DropdownMenuGroup>
          <div className="flex flex-row items-center gap-x-3 p-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
              <AvatarFallback>
                <User className="w-1/2 h-1/2" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.surname} {user?.name}</span>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/users/${userId}/settings`}>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/users/${userId}/bookings`}>
            <DropdownMenuItem className="cursor-pointer">
              <BookingsIcon className="mr-2 h-4 w-4" />
              <span>Bookings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <button className="flex flex-row items-center" onClick={handleLogout} disabled={loggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}