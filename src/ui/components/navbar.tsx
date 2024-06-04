"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kumbh_sans } from "../fonts";
import useAuth from "@/lib/hooks/use-auth";
import { BookingsIcon, LoginIcon, SearchIcon } from "./icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { TUser } from "@/lib/types";
import SearchInput from "./search-input";

export default function NavBar() {
  const pathname = usePathname();
  const { auth, isLoading } = useAuth();
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/users/view/id/${auth.user_id}`, {
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
    if (auth.isAuth) {
      getUser();
    } else {
      setUser(undefined);
    }
  }, [auth.isAuth, auth.user_id]);

  return (
    <div className="fixed w-screen shadow-md top-0 z-10 bg-white">
      <nav className="relative w-full max-w-7xl m-auto flex flex-row items-center justify-between px-4">
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center py-2">
            <Link href="/" className={`${kumbh_sans.className} font-bold text-4xl`}>reservista</Link>
          </div>
        </div>
        <div className="absolute mx-auto left-0 right-0 py-4 w-full max-w-2xl text-md">
          <div className="relative w-full">
            <SearchInput />
          </div>
        </div>
        <div className="flex flex-row items-center gap-x-3 text-nowrap">
          {isLoading ?
            <div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            : auth.isAuth || user !== undefined ?
              <>
                <UserDropdownMenu user={user} userId={auth.user_id} user_roles={auth.user_roles} />
              </>
              :
              pathname !== "/sign-in" ?
                <Link href="/sign-in" className="flex flex-row items-center gap-x-2 rounded-md py-2 px-4 bg-black text-white text-sm hover:bg-[--dark-blue-1] transition active:shadow-[0px_0px_5px_0px_#333333]">
                  <LoginIcon className="w-5 h-5 stroke-white" />
                  Sign in
                </Link>
                :
                <Link href="/sign-up" className="flex flex-row items-center gap-x-2 rounded-md py-2 px-4 bg-black text-white text-sm hover:bg-[--dark-blue-1] transition active:shadow-[0px_0px_5px_0px_#333333]">
                  <LoginIcon className="w-5 h-5 stroke-white" />
                  Sign up
                </Link>
          }
        </div>
      </nav>
    </div>
  )
}


export function UserDropdownMenu({ user, userId, user_roles }: { user: TUser | undefined, userId: string | undefined, user_roles: string[] | undefined }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { setAuth } = useAuth();

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
        setAuth({ isAuth: false, user_id: "", user_roles: [] });
        router.push("/sign-in");
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
            <span className="text-sm font-medium">{user?.name} {user?.surname}</span>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {
          (user_roles ?? []).includes("admin") && (
            <>
              <DropdownMenuGroup>
                <Link href="/admin/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Admin dashboard</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )
        }
        <DropdownMenuGroup>
          <Link href={`/users/${userId}/profile`}>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`/users/${userId}/bookings`}>
            <DropdownMenuItem className="cursor-pointer">
              <BookingsIcon className="mr-2 h-4 w-4" />
              <span>My bookings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <button className="flex flex-row items-center w-full" onClick={handleLogout} disabled={loggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}