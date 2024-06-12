"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useMediaQuery from "@/lib/hooks/use-media-query";
import useAuth from "@/lib/hooks/use-auth";
import { TUser } from "@/lib/types";
import { Button } from "@/ui/custom-components/button";
import { LongRightArrowIcon } from "@/ui/custom-components/icons";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPageMobileMenu({ userId }: { userId: string }) {
  const router = useRouter()
  const { auth, setAuth } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [loggingOut, setLoggingOut] = useState(false);
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
            setIsMounted(true);
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
    if (isDesktop) {
      router.push(`/users/${userId}/profile`);
    }
  }, [router, userId, isDesktop]);

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
        setAuth({ isAuth: false });
        router.push("/sign-in");
      }
    } catch (error: any) {
      if (!error.response) {
        console.error("No server response:", error);
      }
      console.error("Failed to log out:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!isDesktop) {
    return (
      <div className="flex flex-col justify-center px-6 py-4 lg:max-w-60">
        <div className="flex flex-col items-center mb-2">
          {!isMounted ?
            <>
              <div className="w-28 h-28 animate-pulse bg-gray-200 rounded-full"></div>
              <div className="w-28 h-6 animate-pulse bg-gray-200 rounded-md mt-2"></div>
            </>
            :
            <>
              <Avatar className="w-28 h-28">
                <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
                <AvatarFallback className="p-2">
                  <UserIcon className="w-1/2 h-1/2" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mt-2">{user?.name} {user?.surname}</h2>
            </>
          }
        </div>
        <Link href={`/users/${userId}/profile`} className="flex flex-row justify-between items-center p-4 rounded-md hover:bg-muted active:bg-muted transition duration-500">
          <div className="flex flex-row gap-x-2 items-center">
            <div>
              <UserIcon className="w-6 h-6 stroke-gray-500" />
            </div>
            <div>
              <h3 className="text-md">My profile</h3>
            </div>
          </div>
          <div>
            <LongRightArrowIcon className="w-5 h-5 stroke-gray-600" />
          </div>
        </Link>
        <Button onClick={handleLogout} className="max-w-full m-4 rounded-md p-2 flex items-center justify-center bg-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333] disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed" disabled={loggingOut}>Sign out</Button>
      </div>
    )
  }
}
