"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/lib/api";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { TUser } from "@/lib/types";
import { UserIcon } from "@/ui/components/icons";
import MobileTopNavigationBar from "@/ui/components/mobile-top-navigation-bar";
import React, { useEffect, useState } from "react";

export default function UserProfileComponent({userId} : {userId: string}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [user, setUser] = useState<TUser>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await getUserById(userId);
      setUser(user);
      setIsMounted(true);
    };

    getUser();
  }, [userId]);

  if (!isMounted) {
    return null; 
  }

  return (
    <>
      {!isDesktop && (
        <MobileTopNavigationBar menuName="My Profile" />
      )}
      <div className="flex flex-col p-4 lg:p-0">
        <div className="flex flex-col w-full gap-y-3">
          {!isDesktop ? (
            <div className="flex flex-col items-center mb-2">
              <Avatar className="w-28 h-28">
                <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
                <AvatarFallback className="p-2">
                  <UserIcon className="w-1/2 h-1/2" />
                </AvatarFallback>
              </Avatar>
            </div>
          ):(
            <div className="flex flex-col mb-2 border-b border-zinc-200 pb-4">
              <span className="text-2xl font-bold">Basic info</span>  
            </div>
          )}
          <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3">
            <label className="w-full">
              <span className="text-sm text-black">First Name</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="text" value={user.name} />
            </label>
            <label className="w-full">
              <span className="text-sm text-black">Last Name</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="text" value={user.surname} />
            </label>
            <label className="w-full">
              <span className="text-sm text-black">Email</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="email" placeholder="example@domain.com" value={user.email} />
            </label>
            <label className="w-full">
              <span className="text-sm text-black">Phone Number</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="text" value={user.phone} />
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
