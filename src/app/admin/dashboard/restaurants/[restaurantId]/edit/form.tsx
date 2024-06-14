"use client";

import { useToast } from "@/components/ui/use-toast";
import { updateRestaurantBasicInfo } from "@/lib/api";
import useAuth from "@/lib/hooks/use-auth";
import { TRestaurant, TableInput } from "@/lib/types";
import { Button } from "@/ui/custom-components/button";
import { LoadingIcon } from "@/ui/custom-components/icons";
import { Plus, SaveIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { z } from "zod";
import ImageUploader from "./image-uploader";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

const UpdateTableSchema = z.object({
  NumberOfSeats: z.number().int().min(1, "Number of seats must be at least 1"),
  TableNumber: z.number().int().min(1, "Table number must be at least 1"),
  restaurant_id: z.string().uuid("Invalid restaurant id"),
});

const UpdateRestaurantInfoSchema = z.object({
  id: z.string().uuid("Invalid restaurant id").optional(),
  name: z.string().trim().min(8, "Restaurant name must be at least 8 characters").max(64, "Restaurant name must be at most 64 characters"),
  address: z.string().trim().min(8, "Restaurant address must be at least 8 characters").max(64, "Restaurant address must be at most 64 characters"),
  contact: z.string().trim().min(12, "Restaurant contact must be at least 11 digits").max(64, "Restaurant contact must be at most 64 characters"),
});

type UpdateTable = z.infer<typeof UpdateTableSchema>;

type EditRestaurantFormProps = {
  restaurant: TRestaurant;
  restaurant_tables: UpdateTable[];
};

export default function EditRestaurantForm({ restaurant, restaurant_tables }: EditRestaurantFormProps) {
  const { auth } = useAuth();

  const [tables, setTables] = useState<UpdateTable[]>(restaurant_tables || []);
  const [initialTables, setInitialTables] = useState<UpdateTable[]>(restaurant_tables || []);

  const [name, setName] = useState(restaurant.name);
  const [initialName, setInitialName] = useState(restaurant.name);

  const [address, setAddress] = useState(restaurant.address);
  const [initialAddress, setInitialAddress] = useState(restaurant.address);

  const [contact, setContact] = useState(restaurant.contact);
  const [initialContact, setInitialContact] = useState(restaurant.contact);

  const [photos, setPhotos] = useState<FileList | null>(null);
  const [initialPhotos, setInitialPhotos] = useState(restaurant.image_urls);

  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    setInitialTables(restaurant_tables);
    setInitialPhotos(restaurant.image_urls);
    setInitialName(restaurant.name);
    setInitialAddress(restaurant.address);
    setInitialContact(restaurant.contact);
  }, [restaurant, restaurant_tables, photos]);

  const handleAddTable = () => {
    setTables((prevTables) => (
      prevTables
        ? [...prevTables, { NumberOfSeats: 1, TableNumber: prevTables.length + 1, restaurant_id: restaurant.id }]
        : [{ NumberOfSeats: 1, TableNumber: 1, restaurant_id: restaurant.id }]));
  };

  const handleTableChange = (index: number, key: keyof TableInput, value: string) => {
    if (tables) {
      const newTables = [...tables];
      (newTables[index] as any)[key] = value === "" ? "" : parseInt(value);
      setTables(newTables);
    }
  };

  const handleDeleteTable = (index: number) => {
    if (tables) {
      const newTables = tables.filter((_, i) => i !== index);
      setTables(newTables);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validationResult = UpdateRestaurantInfoSchema.safeParse({ id: restaurant.id, name, address, contact });

    if (!validationResult.success) {
      let validationErrors = validationResult.error.issues.reduce((acc, issue) => {
        return {
          ...acc,
          [issue.path[0]]: issue.message
        };
      }, {} as Record<string, string>);
      console.log("VAlIDATION ERRORS",validationErrors);
      setFormErrors(validationErrors);
      return;
    }

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedContact = contact.trim();

    const changedData: Partial<{
      name: string;
      address: string;
      contact: string;
      tables: UpdateTable[];
      photos: FileList | null;
    }> = {};

    if (trimmedName !== initialName) changedData.name = trimmedName;
    if (trimmedAddress !== initialAddress) changedData.address = trimmedAddress;
    if (trimmedContact !== initialContact) changedData.contact = trimmedContact;

    const tablesChanged = tables && Object.entries(tables).length !== 0;
    if (tablesChanged && initialTables) {
      const newTables = tables.filter((table, index) => {
        const initialTable = initialTables[index];
        if (!initialTable) return true;
        return table.NumberOfSeats !== initialTable.NumberOfSeats || table.TableNumber !== initialTable.TableNumber;
      });
      if (newTables.length > 0) changedData.tables = newTables;
    } else if (tablesChanged) {
      changedData.tables = tables;
    }

    if (photos?.length ?? 0 > 0) changedData.photos = photos;

    const noChanges = Object.entries(changedData).length === 0;

    if (noChanges) {
      return;
    }

    setIsLoading(true);

    console.log("WE ARE HERE");
    if (changedData.name !== initialName && changedData.address !== initialAddress && changedData.contact !== initialContact) {
      const restData: TRestaurant = {
        id: restaurant.id,
        name: name,
        address: address,
        contact: contact
      }

      const restResponse = await updateRestaurantBasicInfo(restData);

      if (restResponse.status !== 200) {
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "An error occurred while updating the restaurant info.",
        })
        setIsLoading(false);
        return
      }
    }

    if (changedData.tables) {
      for (let table of changedData.tables) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tables/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            number_of_seats: table.NumberOfSeats,
            table_number: table.TableNumber,
            restaurant_id: table.restaurant_id,
          }),
        });

        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh!",
            description: "An error occurred while updating the tables.",
          })
          setIsLoading(false);
          return
        }
      }
    }

    if (changedData.photos) {
      for (const file of Array.from(changedData.photos)) {
        const formData = new FormData();
        formData.append("photos", file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/restaurants/photos/upload/${restaurant.id}`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh!",
            description: "An error occurred while updating the photos.",
          })
          setIsLoading(false);
          return
        }
      }
    }

    toast({
      title: "Success!",
      description: "Restaurant info updated successfully.",
    });

    
    setName(changedData.name || name);
    setAddress(changedData.address || address);
    setContact(changedData.contact || contact);
    setInitialTables(changedData.tables?.length ? [...initialTables, ...changedData.tables] : tables);

    setIsLoading(false);
    router.refresh();
  };

  return (
    <form className="flex flex-col gap-y-3 text-sm" onSubmit={handleSubmit}>
      <div className="flex">
        <span className="text-xl font-bold">Basic info</span>
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="name">Restaurant name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`p-2 border border-gray-300 rounded-md focus-visible:outline outline-1 ${formErrors.name ? "border-red-500" : ""}`}
          required
        />
        {formErrors.name && <span className="text-red-500 text-xs">{formErrors.name}</span>}
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`p-2 border border-gray-300 rounded-md focus-visible:outline outline-1 ${formErrors.address ? "border-red-500" : ""}`}
          required
        />
        {formErrors.address && <span className="text-red-500 text-xs">{formErrors.address}</span>}
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="contact">Contact</label>
        <PhoneInput
          name="contact"
          className={`mt-1 phone-input coutry-selector country-selector-dropdown dial-code-preview ${formErrors.contact ? "phone-input-error" : ""}`}
          inputStyle={{ "width": "100%" }}
          value={contact}
          onChange={setContact}
          required
        />
        {formErrors.contact && <span className="text-red-500 text-xs">{formErrors.contact}</span>}
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-11 gap-y-3 border-t pt-6 mt-5">
        <div className="col-span-11">
          <span className="text-xl font-bold">Tables</span>
        </div>
        {
          tables && (
            <div className="flex flex-row lg:grid lg:grid-cols-11 lg:col-span-11 gap-x-2 border-b pb-2">
              <span className="text-sm col-span-5">Number of seats</span>
              <span className="text-sm col-span-5">Table number</span>
            </div>
          )
        }

        {tables && tables.map((table, index) => (
          <div className="flex flex-row lg:grid lg:grid-cols-11 lg:col-span-11 gap-x-2" key={index}>
            <input
              type="number"
              placeholder="Number of Seats"
              value={table.NumberOfSeats}
              onChange={(e) => handleTableChange(index, "NumberOfSeats", e.target.value)}
              className="col-span-5 w-full p-2 border border-gray-300 rounded-md focus-visible:outline outline-1"
              required
            />
            <input
              type="number"
              placeholder="Table Number"
              value={table.TableNumber}
              onChange={(e) => handleTableChange(index, "TableNumber", e.target.value)}
              className="col-span-5 w-full p-2 border border-gray-300 rounded-md focus-visible:outline outline-1"
              required
            />
            {index >= (initialTables?.length || 0) && (
              <button
                type="button"
                onClick={() => handleDeleteTable(index)}
                className="flex justify-center items-center w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <div className="flex flex-row-reverse lg:ml-2 lg:col-start-11">
          <Button
            variant="outlined"
            type="button"
            onClick={handleAddTable}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add table
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col gap-y-3 border-t pt-6 mt-5">
        <div className="flex">
          <span className="text-xl font-bold">Gallery</span>
        </div>
        {
          !initialPhotos ? (
            <div className="text-sm text-gray-500 text-center">
              No photos uploaded
            </div>
          ) : (
            <Carousel
              opts={{
                align: "center",
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {
                  initialPhotos.map((photo, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
                      <div key={index} className="relative w-full h-52 overflow-hidden mx-auto">
                        <Image src={photo.toString()} alt="Preview" className="object-cover rounded-md" fill />
                      </div>
                    </CarouselItem>
                  ))
                }
              </CarouselContent>
              {
                initialPhotos?.length !== 0 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )
              }
            </Carousel>
          )
        }

        <ImageUploader photos={photos} setPhotos={setPhotos} />
      </div>
      <div className="mt-6 w-full flex md:flex-row-reverse">
        <Button type="submit" disabled={isLoading} className="gap-x-2">
          {
            isLoading ? (
              <div className="flex flex-row items-center justify-center gap-x-2">
                <div className="w-4 h-4 border-t-2 border-r-2 border-gray-500 rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <><SaveIcon className="w-5 h-5" />Save</>
            )
          }
        </Button>
      </div>
    </form >

  )
}
