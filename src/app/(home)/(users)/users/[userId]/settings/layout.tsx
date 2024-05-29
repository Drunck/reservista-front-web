"use client";

import useMediaQuery from "@/hooks/use-media-query";
import clsx from "clsx";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function SettingsPageLayout({ children, params }: { children: React.ReactNode, params: { userId: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const userId = params.userId;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop) {
      router.push(`/users/${userId}/settings/info`);
    }
  }, [isDesktop, userId]);

  if (!isDesktop) {
    return (
      <>
        {children}
      </>
    )
  }
  
  return (
    <div className="flex flex-row gap-x-12">
      <div className="flex flex-col w-full max-w-60 gap-y-2">
        <Link href="/users/1/settings/info" className={
          clsx(
            "flex flex-row justify-between items-center px-4 py-2.5 rounded-md hover:bg-muted",
            { "bg-muted": pathname.includes("/settings/info"),},
            )}>
          <div className="flex flex-row gap-x-2 items-center">
            <div>
              <UserIcon className="w-5 h-5 stroke-gray-500" />
            </div>
            <div>
              <h3 className="text-sm">My Profile</h3>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        {children}
      </div>
    </div>
  )
}
