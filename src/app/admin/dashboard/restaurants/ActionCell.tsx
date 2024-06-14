import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { deleteRestaurant } from "@/lib/api";
import { TRestaurant } from "@/lib/types";
import { Clipboard, ExternalLinkIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type ActionsCellProps = {
  restaurant: TRestaurant;
};

const ActionsCell: React.FC<ActionsCellProps> = ({ restaurant }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const response = await deleteRestaurant(restaurant.id);
    setIsDeleting(false);
    if (response.status === 200) {
      toast({
        title: "Restaurant deleted",
        description: "The restaurant was deleted successfully.",
      });
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Error deleting restaurant",
        description: response.message,
      });
    }
  };

  return (
    <AlertDialog>
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
            <Link href={`/admin/dashboard/restaurants/${restaurant.id}/edit/`} className="w-full">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full flex flex-row items-center cursor-pointer text-red-500">
            <AlertDialogTrigger asChild>
              <button className="w-full flex flex-row items-center cursor-pointer">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete restaurant and remove data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex flex-row items-center justify-center gap-x-2">
                <div className="w-4 h-4 border-t-2 border-r-2 border-gray-500 rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </div>
            ) : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionsCell;
