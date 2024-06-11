"use client";

import { useToast } from "@/components/ui/use-toast";
import { updateRestaurantBasicInfo } from "@/lib/api";
import useAuth from "@/lib/hooks/use-auth";
import { TRestaurant, Table } from "@/lib/types";
import { Button } from "@/ui/custom-components/button";
import { LoadingIcon } from "@/ui/custom-components/icons";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { z } from "zod";

const UpdateTableSchema = z.object({
  NumberOfSeats: z.number().int().min(1, "Number of seats must be at least 1"),
  TableNumber: z.number().int().min(1, "Table number must be at least 1"),
  restaurant_id: z.string().uuid("Invalid restaurant id"),
});

const UpdateRestaurantInfoSchema = z.object({
  id: z.string().uuid("Invalid restaurant id").optional(),
  name: z.string().trim().min(8, "Restaurant name must be at least 8 characters").max(64, "Restaurant name must be at most 64 characters"),
  address: z.string().trim().min(8, "Restaurant address must be at least 8 characters").max(64, "Restaurant address must be at most 64 characters"),
  contact: z.string().trim().min(8, "Restaurant contact must be at least 8 digits").max(64, "Restaurant contact must be at most 64 characters"),
});

type UpdateTable = z.infer<typeof UpdateTableSchema>;

type EditRestaurantFormProps = {
  restaurant: TRestaurant;
  restaurant_tables: UpdateTable[];
};

export default function EditRestaurantForm({ restaurant, restaurant_tables }: EditRestaurantFormProps) {
  const { auth } = useAuth();

  const [tables, setTables] = useState<UpdateTable[] | undefined>(restaurant_tables);
  const [initialTables, setInitialTables] = useState<UpdateTable[] | undefined>(restaurant_tables);

  const [name, setName] = useState(restaurant.name);
  const [initialName, setInitialName] = useState(restaurant.name);

  const [address, setAddress] = useState(restaurant.address);
  const [initialAddress, setInitialAddress] = useState(restaurant.address);

  const [contact, setContact] = useState(restaurant.contact);
  const [initialContact, setInitialContact] = useState(restaurant.contact);

  const [photos, setPhotos] = useState<FileList | null>(null);
  const [initialPhotos, setInitialPhotos] = useState<FileList | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  useEffect(() => {
    setInitialTables(restaurant_tables);
    setInitialPhotos(photos);
    setInitialName(restaurant.name);
    setInitialAddress(restaurant.address);
    setInitialContact(restaurant.contact);
    console.log("RESTAURANT", restaurant);
    console.log("RESTAURANT TABLES", restaurant_tables);
  }, [restaurant, restaurant_tables]);


  // const [tables, setTables] = useState<Table[]>([]);
  // const [photos, setPhotos] = useState<FileList | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const handleAddTable = () => {
  //   setTables((prevTables) => (prevTables ? [...prevTables, { id: "", NumberOfSeats: 1, TableNumber: prevTables.length + 1, restaurant: { id: "", name: "", address: "", contact: "" } }] : [{ id: "", NumberOfSeats: 1, TableNumber: 1, restaurant: { id: "", name: "", address: "", contact: "" } }]));
  // };


  const handleAddTable = () => {
    setTables((prevTables) => (
      prevTables
        ? [...prevTables, { NumberOfSeats: 1, TableNumber: prevTables.length + 1, restaurant_id: restaurant.id }]
        : [{ NumberOfSeats: 1, TableNumber: 1, restaurant_id: restaurant.id }]));
  };

  const handleTableChange = (index: number, key: keyof Table, value: string | number) => {
    if (tables) {
      const newTables = [...tables];
      (newTables[index] as any)[key] = value;
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
      console.log("VALIDATION ERRORS", validationResult.error.issues);
      let validationErrors = validationResult.error.issues.reduce((acc, issue) => {
        return {
          ...acc,
          [issue.path[0]]: issue.message
        };
      }, {} as Record<string, string>);
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

    const noChanges = Object.entries(changedData).length === 0;

    if (noChanges) {
      return;
    }

    const restData: TRestaurant = {
      id: restaurant.id,
      name: name,
      address: address,
      contact: contact
    }

    if (photos && photos !== initialPhotos) changedData.photos = photos;

    setIsLoading(true);

    const restResponse = await updateRestaurantBasicInfo(restData);

    if (restResponse.status !== 200) {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: "An error occurred while updating the restaurant info.",
      })
      return
    }

    // if (changedData.tables) {
    //   for (let table of changedData.tables) {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tables/add`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         number_of_seats: table.NumberOfSeats,
    //         is_reserved: false,
    //         table_number: table.TableNumber,
    //         restaurant_id: table.restaurant_id,
    //       }),
    //     });

    //     if (!response.ok) {
    //       toast({
    //         variant: "destructive",
    //         title: "Uh oh!",
    //         description: "An error occurred while updating the tables.",
    //       })
    //       return
    //     }
    //   }
    // }

    // if (photos) {
    //   const formData = new FormData();
    //   Array.from(photos).forEach((file) => {
    //     formData.append('photos', file);
    //   });

    //   await fetch(`/api/photos/upload/${restaurant.id}`, {
    //     method: 'POST',
    //     body: formData,
    //   });
    // }

    toast({
      title: "Success!",
      description: "Restaurant info updated successfully.",
    });

    setIsLoading(false);
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
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
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
          value={address}
          onChange={(e) => setAddress(e.target.value.trim())}
          className={`p-2 border border-gray-300 rounded-md focus-visible:outline outline-1 ${formErrors.address ? "border-red-500" : ""}`}
          required
        />
        {formErrors.address && <span className="text-red-500 text-xs">{formErrors.address}</span>}
      </div>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="contact">Contact</label>
        <PhoneInput
          name="restaurant_contact"
          className={`mt-1 phone-input coutry-selector country-selector-dropdown dial-code-preview ${formErrors.contact ? "border-red-500" : ""}`}
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
              onChange={(e) => handleTableChange(index, "NumberOfSeats", parseInt(e.target.value))}
              className="col-span-5 w-full p-2 border border-gray-300 rounded-md focus-visible:outline outline-1"
              required
            />
            <input
              type="number"
              placeholder="Table Number"
              value={table.TableNumber}
              onChange={(e) => handleTableChange(index, "TableNumber", parseInt(e.target.value))}
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
            className="lg:w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add table
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-3 border-t pt-6 mt-5">
        <div className="flex">
          <span className="text-xl font-bold">Photos</span>
        </div>
        <input type="file" multiple onChange={(e) => setPhotos(e.target.files)} />
      </div>
      <div className="mt-6 w-full flex md:flex-row-reverse">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingIcon className="w-6 h-6 animate-spin" /> : "Submit"}
        </Button>
      </div>
    </form >

  )
}
