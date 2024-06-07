"use client";

import { LongRightArrowIcon } from "./icons";
import { useRouter } from "next/navigation";

export default function MobileTopNavigationBar({ menuName, className }: { menuName?: string, className?: string}) {
  const router = useRouter();

  return (
    <div className={`flex flex-row p-4 items-center gap-x-5 border-b h-[61px] ${className}`}>
      <div className="absolute border border-gray-300 rounded-full p-2 hover:cursor-pointer hover:bg-gray-100/50 active:bg-gray-100/50" onClick={() => router.back()} >
        <LongRightArrowIcon className="w-5 h-5 stroke-gray-500 rotate-180" />
      </div>
      {
        menuName !== "" ? (
          <h2 className="text-lg font-semibold mx-auto">{menuName}</h2>
        ) : (null)
      }
    </div>
  )
}
