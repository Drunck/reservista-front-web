"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { useRef, useState } from "react";
import { Button } from "@/ui/custom-components/button";
import { AddRestaurant, AddRestaurantSchema } from "@/lib/types";
import { PhoneInput } from "react-international-phone";
import { useToast } from "@/components/ui/use-toast";
import { LoadingIcon } from "@/ui/custom-components/icons";
import "react-international-phone/style.css";

export function CreateRestaurantButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [contactNumber, setContactNumber] = useState("");
  const [restaurant, setRestaurant] = useState<AddRestaurant>({
    restaurant_name: "",
    restaurant_address: "",
    restaurant_contact: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value
    });
  }

  const handleAddRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsLoading(true);

    restaurant.restaurant_contact = contactNumber;
    const result = AddRestaurantSchema.safeParse(restaurant);
    if (!result.success) {
      let validationErrors = result.error.issues.reduce((acc, issue) => {
        return {
          ...acc,
          [issue.path[0]]: issue.message
        };
      }, {} as Record<string, string>);

      setFormErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_URL}/api/restaurants/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(restaurant)
    });
    const data = await response.json();
    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Problem while adding restaurant",
        description: "An error occurred while adding the restaurant. Please try again later."
      })
      return;
    } else {
      setOpen(false);
      setRestaurant({
        restaurant_name: "",
        restaurant_address: "",
        restaurant_contact: "",
      });
      setContactNumber("");
      toast({
        title: "Restaurant added",
        description: "The restaurant has been added successfully."
      })
    }
    setIsLoading(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="box-border bg-white border-black border px-4 py-2 rounded max-w-fit float-left transition hover:bg-zinc-100 active:border-gray-400 text-sm">
            Add restaurant
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-full md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add restaurant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRestaurantSubmit}>
            <div className="flex flex-col gap-y-5 text-sm">
              <div className="flex flex-col gap-y-1">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="restaurant_name"
                  value={restaurant?.restaurant_name}
                  onChange={handleChange}
                  className={
                    `w-full rounded-md p-2 border focus-visible:outline outline-1
                    ${formErrors.restaurant_name ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}
                    `
                  }
                />
                {
                  formErrors.restaurant_name && <span className="text-sm text-red-500">{formErrors.restaurant_name}</span>
                }
              </div>
              <div className="flex flex-col gap-y-1">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="restaurant_address"
                  value={restaurant?.restaurant_address}
                  onChange={handleChange}
                  className={`w-full rounded-md p-2 border focus-visible:outline outline-1 ${formErrors.restaurant_address ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`}
                />
                {
                  formErrors.restaurant_address && <span className="text-sm text-red-500">{formErrors.restaurant_address}</span>
                }
              </div>
              <div className="flex flex-col gap-y-1">
                <label htmlFor="contact">Contact number</label>
                <PhoneInput
                  name="restaurant_contact"
                  className={`mt-1 phone-input coutry-selector country-selector-dropdown dial-code-preview' 
                  ${formErrors.restaurant_contact ? (
                      "phone-input-error"
                    ) : ("")}`}
                  inputStyle={{ "width": "100%" }}
                  value={contactNumber}
                  onChange={setContactNumber}
                  required
                />

                {formErrors?.restaurant_contact && <span className="text-sm text-red-400 mt-1">{formErrors.restaurant_contact}</span>}
                {/* <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={restaurant?.contact}
                  onChange={handleChange}
                  className={`w-full rounded-md p-2 border focus-visible:outline outline-1 ${formErrors.contact ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`}
                />
                {
                  formErrors.contact && <span className="text-sm text-red-500">{formErrors.contact}</span>
                } */}
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <Button
                className="w-full md:max-w-fit mt-5"
              >
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="box-border bg-white border-black border px-4 py-2 rounded max-w-fit float-left transition hover:bg-zinc-100 active:border-gray-400 text-sm">
          Add restaurant
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add restaurant</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleAddRestaurantSubmit}>
          <div className="px-4">
            <div className="flex flex-col gap-y-5 text-sm">
              <div className="flex flex-col gap-y-1">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="restaurant_name"
                  value={restaurant?.restaurant_name}
                  onChange={handleChange}
                  className={`w-full rounded-md p-2 border focus-visible:outline outline-1 ${formErrors.restaurant_name ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`}
                />

                {
                  formErrors.restaurant_name && <span className="text-sm text-red-500">{formErrors.restaurant_name}</span>
                }
              </div>
              <div className="flex flex-col gap-y-1">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="restaurant_address"
                  value={restaurant?.restaurant_address}
                  onChange={handleChange}
                  className={`w-full rounded-md p-2 border focus-visible:outline outline-1 ${formErrors.restaurant_address ? "border-red-400 bg-red-50 focus-visible:outline-red-500" : "border-gray-300"}`}
                />

                {
                  formErrors.restaurant_address && <span className="text-sm text-red-500">{formErrors.restaurant_address}</span>
                }
              </div>
              <div className="flex flex-col gap-y-1">
                <label htmlFor="contact">Contact number</label>
                <PhoneInput
                  name="contact"
                  className={`mt-1 phone-input coutry-selector country-selector-dropdown dial-code-preview' 
                  ${formErrors.contact ? (
                      "phone-input-error"
                    ) : ("")}`}
                  inputStyle={{ "width": "100%" }}
                  value={contactNumber}
                  onChange={setContactNumber}
                  required
                />

                {formErrors?.restaurant_contact && <span className="text-sm text-red-400 mt-1">{formErrors.restaurant_contact}</span>}
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <Button
                className="w-full md:max-w-fit mt-5"
                disabled={isLoading}
              >
                {isLoading ? <LoadingIcon className="w-6 h-6" /> : "Add"}
              </Button>
            </div>
          </div>
        </form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button ref={buttonRef} variant="outlined">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

