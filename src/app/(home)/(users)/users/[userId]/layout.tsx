"use client";

import React, { useEffect, useState } from "react";
import UserPageSideMenu from "./user-page-desktop-side-menu";

export default function UserPageLayout({ children, params }: { children: React.ReactNode, params:{ userId:string } }) {
  const userId = params.userId;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto lg:px-4">
      <div className="flex flex-row gap-x-12">
        <UserPageSideMenu userId={userId} />
        <div className="flex flex-col w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

