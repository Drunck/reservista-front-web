import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LongRightArrowIcon, MenuIcon } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import useAuth from "@/lib/hooks/use-auth";
import { TUser } from "@/lib/types";
import { Button } from "./button";

export function MobilePopupSideBar({ ...props }: { isMounted: boolean, user: TUser | undefined, userId: string }) {
  const { setAuth } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        setAuth({ isAuth: false });
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="active:bg-gray-200/30 flex justify-center">
          <div className="relative pt-3 pb-1 flex flex-col items-center">
            <MenuIcon className="w-6 h-6" />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col justify-center px-2 py-4 gap-y-5">
          {!props.isMounted ?
            <div className="flex flex-col items-center mb-2">
              <div className="w-28 h-28 animate-pulse bg-gray-200 rounded-full"></div>
              <div className="w-28 h-6 animate-pulse bg-gray-200 rounded-md mt-2"></div>
            </div>
            :
            <div className="flex flex-col items-center mb-2">
              <Avatar className="w-28 h-28">
                <AvatarImage src="/images/user.jpg" alt="User" className="object-cover" />
                <AvatarFallback className="p-2">
                  <UserIcon className="w-1/2 h-1/2" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mt-2">{props.user?.name} {props.user?.surname}</h2>
            </div>
          }
          <Link href={`/users/${props.userId}/settings/info`} className="flex flex-row justify-between items-center p-4 rounded-md hover:bg-muted active:bg-muted transition duration-500">
            <div className="flex flex-row gap-x-2 items-center">
              <div>
                <UserIcon className="w-6 h-6 stroke-gray-500" />
              </div>
              <div>
                <h3 className="text-md">My Profile</h3>
              </div>
            </div>
            <div>
              <LongRightArrowIcon className="w-5 h-5 stroke-gray-600" />
            </div>
          </Link>
          <Button onClick={handleLogout} className="max-w-full w-full rounded-md flex items-center justify-center bg-black text-white transition duration-300 hover:bg-[--dark-blue-1] active:shadow-[0px_0px_5px_0px_#333333] disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed">Sign out</Button>
        </div>
      </SheetContent>
    </Sheet >
  )
}
