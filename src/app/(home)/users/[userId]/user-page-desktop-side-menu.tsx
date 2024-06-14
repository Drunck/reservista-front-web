"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/lib/hooks/use-auth";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { TUser } from "@/lib/types";
import { BookingsIcon, HalfFullHeartIcon } from "@/ui/custom-components/icons";
import clsx from "clsx";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPageSideMenu({ userId }: { userId: string }) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { auth } = useAuth();
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      if (auth.isAuth) {
        try {
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
          return;
        }
      }
    };
    getUser();
  }, [auth.isAuth, auth.user_id, userId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isDesktop || !isMounted) return null;

  return (
    <div className="flex flex-col w-full max-w-60">
      <div className="flex flex-col w-full gap-y-2 border rounded-md py-4">
        <div className="flex flex-col items-center mb-2">
          <Avatar className="w-28 h-28">
            <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
            <AvatarFallback className="p-2">
              <UserIcon className="w-1/2 h-1/2" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xl font-semibold mt-2">{user?.name} {user?.surname}</span>
          <span className="text-sm">{user?.email}</span>
        </div>
        <Link href={`/users/${userId}/profile`} className={
          clsx(
            "relative flex flex-row justify-between items-center px-4 py-2.5 hover:bg-muted",
            { "bg-muted before:content-[''] before:bg-black before:w-1 before:min-h-full before:rounded-r-lg before:absolute before:left-0 before:top-0": pathname.includes(`/users/${userId}/profile`), },
          )}>
          <div className="flex flex-row gap-x-2 items-center">
            <div>
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm">My profile</h3>
            </div>
          </div>
        </Link>
        <Link href={`/users/${userId}/bookings`} className={
          clsx(
            "relative flex flex-row justify-between items-center px-4 py-2.5 hover:bg-muted",
            { "bg-muted before:content-[''] before:bg-black before:w-1 before:min-h-full before:rounded-r-lg before:absolute before:left-0 before:top-0": pathname.includes("/bookings"), },
          )}>
          <div className="flex flex-row gap-x-2 items-center">
            <div>
              <BookingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm">Bookings</h3>
            </div>
          </div>
        </Link>
        <Link href={`/users/${userId}/favourites`} className={
          clsx(
            "relative flex flex-row justify-between items-center px-4 py-2.5 hover:bg-muted",
            { "bg-muted before:content-[''] before:bg-black before:w-1 before:min-h-full before:rounded-r-lg before:absolute before:left-0 before:top-0": pathname.includes("/favourites"), },
          )}>
          <div className="flex flex-row gap-x-2 items-center">
            <div>
              <HalfFullHeartIcon className="w-5 h-5 " />
            </div>
            <div>
              <h3 className="text-sm">Favourites</h3>
            </div>
          </div>
        </Link>
      </div>

    </div>
  )
}
