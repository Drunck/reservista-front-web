"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useMediaQuery from "@/hooks/use-media-query";
import useAuth from "@/lib/auth-context";
import { TUser } from "@/lib/types";
import { Button } from "@/ui/components/button";
import { LongRightArrowIcon, UserIcon } from "@/ui/components/icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function UserInfoPage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const userId = params.userId;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  const { isAuth, isLoading } = useAuth();
  const [user, setUser] = useState<TUser>({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const getUser = async () => {
      if (isAuth && !isLoading) {
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
  }, [isAuth, isLoading, userId]);

  return (
    <>
      {!isDesktop && (
        <div className="flex flex-row p-4 items-center gap-x-5 border-b">
          <div className="absolute border border-gray-200 rounded-full p-2 hover:cursor-pointer hover:bg-gray-100/50 active:bg-gray-100/50" onClick={() => router.back()} >
            <LongRightArrowIcon className="w-5 h-5 stroke-gray-600 rotate-180" />
          </div>
          <h2 className="text-lg font-semibold mx-auto">My Profile</h2>
        </div>
      )}
      <div className="flex flex-col p-4 lg:p-0">
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex flex-col items-center mb-2">
            <Avatar className="w-28 h-28">
              <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
              <AvatarFallback className="p-2">
                <UserIcon className="w-1/2 h-1/2" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full grid grid-cols-2 gap-x-2 gap-y-3">
            <label className="w-full">
              <span className="text-sm text-black">First Name</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="text" value={user?.name} />
            </label>
            <label className="w-full">
              <span className="text-sm text-black">Last Name</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="text" value={user?.surname} />
            </label>
            <label className="w-full">
              <span className="text-sm text-black">Email</span>
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="email" placeholder="example@domain.com" value={user?.email} />
            </label>
            <label className="w-full">
              <span className="text-sm text-black">Phone Number</span>
              {/* <PhoneInput name="phone" disabled={true} className="w-full mt-1 phone-input-profile coutry-selector country-selector-dropdown dial-code-preview" inputStyle={{ "width": "100%" }} value={user?.phone} /> */}
              <input disabled={true} className="w-full min-w-full py-1.5 px-4 mt-1 transition rounded-md border border-gray-400 focus:outline focus:outline-1 focus:outline-gray-700 disabled:bg-gray-50 disabled:border disabled:border-gray-300 disabled:text-gray-500" type="text" value={user?.phone} />
            </label>
          </div>
          {/* <Button className="w-40 rounded-md p-2 flex justify-center text-sm bg-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333] mt-5">Save</Button> */}
        </div>
      </div>
    </>

  )
}
