"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TRestaurant } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { Clipboard, ExternalLinkIcon, MoreHorizontal, Pencil, Trash, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Restaurant = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const restaurantColumns: ColumnDef<TRestaurant>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const restaurant = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="w-full">Actions</DropdownMenuLabel>
            <DropdownMenuItem className="w-full flex flex-row items-center cursor-pointer"
              onClick={() => navigator.clipboard.writeText(restaurant.id)}
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full flex flex-row items-center cursor-pointer">
              <ExternalLinkIcon className="w-4 h-4 mr-2" />
              <a target="_blank" href={`${process.env.NEXT_PUBLIC_DEV_URL}/restaurants/${restaurant.id}`} className="w-full">
                View web page
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full flex flex-row items-center cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" />
              <Link href={`/admin/dashboard/restaurants/edit/${restaurant.id}`} className="w-full">
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="w-full flex flex-row items-center cursor-pointer text-red-500">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
