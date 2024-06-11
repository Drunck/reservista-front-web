import clsx from "clsx";
import { PieChartIcon, StoreIcon, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminPanelSideMenu() {
  const pathname = usePathname();
  return (
    <div className="fixed w-full max-w-64 h-[--admin-sidebar-height] overflow-x-hidden border-r bg-white z-10">
        <div className="flex flex-col w-full p-4 gap-y-2 bg-white">
          <Link href="/admin/dashboard"
            className={
              clsx("w-full px-4 py-2 rounded-md flex flex-row gap-x-2 text-sm  items-center transition active:shadow",
                {
                  "text-white bg-[#18181b] hover:bg-[--dark-blue-1] shadow-sm": pathname === "/admin/dashboard",
                  "text-black hover:bg-muted": pathname !== "/admin/dashboard"
                }
              )
            }>
            <PieChartIcon className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/dashboard/restaurants"
            className={
              clsx("w-full px-4 py-2 rounded-md flex flex-row gap-x-2 text-sm  items-center transition active:shadow",
                {
                  "text-white bg-[#18181b] hover:bg-[--dark-blue-1] shadow-sm": pathname.includes("/admin/dashboard/restaurants"),
                  "text-black hover:bg-muted": !pathname.includes("/admin/dashboard/restaurants")
                }
              )
            }>
            <StoreIcon className="w-4 h-4" />
            <span>Restaurants</span>
          </Link>
          <Link href="/admin/dashboard/users"
            className={
              clsx("w-full px-4 py-2 rounded-md flex flex-row gap-x-2 text-sm  items-center transition active:shadow",
                {
                  "text-white bg-[#18181b] hover:bg-[--dark-blue-1] shadow-sm": pathname.includes("/admin/dashboard/users"),
                  "text-black hover:bg-muted": !pathname.includes("/admin/dashboard/users")
                }
              )
            }>
            <Users className="w-4 h-4" />
            <span>Users</span>
          </Link>
        </div>
      </div>
  )
}
