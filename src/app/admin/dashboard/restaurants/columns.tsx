"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { deleteRestaurant } from "@/lib/api"
import { TRestaurant } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { Clipboard, ExternalLinkIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ActionsCell from "./ActionCell"

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
    cell: ({ row }) => <ActionsCell restaurant={row.original} />,
  },
]
