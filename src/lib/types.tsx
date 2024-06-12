import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password must be at most 64 characters").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).*$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export type TSignIn = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().trim().min(1, "First name must be at least 1 characters").max(64, "First name must be at most 64 characters"),
  surname: z.string().trim().min(1, "Last name must be at least 1 characters").max(64, "Last name must be at most 64 characters"),
  phone: z.string().trim().min(12, "Phone number must be at least 12 digits"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(8, "Password must be at least 8 characters").max(64, "Password must be at most 64 characters").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).*$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export type TSignUp = z.infer<typeof SignUpSchema>;

export const ActivationCodeSchema = z.object({
  Code: z.string().trim().length(6, "Activation code must be 6 characters")
});

export type TActivationCode = z.infer<typeof ActivationCodeSchema>;

export const UserSchema = z.object({
  id: z.string().uuid("Invalid user id").optional(),
  name: z.string().trim().min(1, "First name must be at least 1 characters").max(64, "First name must be at most 64 characters"),
  surname: z.string().trim().min(1, "Last name must be at least 1 characters").max(64, "Last name must be at most 64 characters"),
  phone: z.string().trim().min(12, "Phone number must be at least 12 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(8, "Password must be at least 8 characters").max(64, "Password must be at most 64 characters").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).*$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character").optional(),
});

export type User = z.infer<typeof UserSchema>;

export type TUser = {
  id?: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
}

export type JWTTokenUser = {
  user_id: string;
  user_email?: string;
  roles?: string[];
  activated?: boolean;
  exp?: number;
}


export type Auth = {
  isAuth: boolean;
  user_id?: string;
  user_roles?: string[];
}

export type AuthContextType = {
  auth: Auth;
  setAuth: (auth: Auth) => void;
  isLoading: boolean;
}

export type TAuthContext = {
  isAuth: boolean;
  isLoading: boolean;
  userId?: string;
  setIsAuth: (isAuth: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const TableInputSchema = z.object({
  NumberOfSeats: z.number().int().min(1, "Number of seats must be at least 1"),
  TableNumber: z.number().int().min(1, "Table number must be at least 1"),
});

export type TableInput = z.infer<typeof TableInputSchema>;

export const TableSchema = z.object({
  id: z.string().uuid("Invalid table id").optional(),
  NumberOfSeats: z.number().int().min(1, "Number of seats must be at least 1"),
  IsReserved: z.boolean().optional(),
  TableNumber: z.number().int().min(1, "Table number must be at least 1"),
  restaurant: z.object({
    id: z.string().uuid("Invalid restaurant id"),
    name: z.string().trim().min(1, "Restaurant name must be at least 1 characters").max(64, "Restaurant name must be at most 64 characters"),
    address: z.string().trim().min(1, "Restaurant address must be at least 1 characters").max(64, "Restaurant address must be at most 64 characters"),
    contact: z.string().trim().min(1, "Restaurant contact must be at least 1 characters").max(64, "Restaurant contact must be at most 64 characters"),
  }),
});

export type Table = z.infer<typeof TableSchema>;

export type TReservation = {
  id: string;
  table: Table;
  reservationTime: string;
  reservationDate: {
    seconds: number;
  }
};

export type TRestaurant = {
  id: string;
  name: string;
  address: string;
  contact: string;
  restaurant_cuisine?: string;
  description?: string,
  reviews?: object[];
  menu?: object[];
  image_urls?: object[];
}

export type TRestaurantReservation = {
  id: string;
  table_id: string;
  reservation_time: string;
}

export type TRestaurantTables = {
  id: string;
  table_number: number;
  number_of_seats: number;
  status?: "available" | "reserved" | "selected";
}

export const ReservationSchema = z.object({
  table_id: z.string().uuid("Invalid table id"),
  reservation_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
});

export type ReservationInput = {
  table_id: string;
  reservation_time: string;
}

export type TResponse = {
  status: number;
  message: string;
}

export type TRestaurantsResponse = TResponse & {
  restaurants?: TRestaurant[]
  totalPages?: number;
}

export type TRestaurantReservationsResponse = TResponse & {
  data: {
    reservations?: TReservation[];
  }
}

export type TReservationsResponse = TResponse & {
  reservations?: TReservation[];
}

export type TRestaurantSearchSuggestionsResponse = TResponse & {
  suggestions?: TRestaurant[];
}

export type FetchState = "loading" | "error" | "success";

export const times = ["8:00 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

export type ReponsiveDrawerDialogProps = {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  title: string;
  description?: string;
  triggerButtonText: string;
  triggerButtonVariant?: string;
  closeButtonText: string;
  children: React.ReactNode;
}

export type MobileSideBarProps = {
  children: React.ReactNode;
}

export type RestaurantSearchQueryParams = {
  q?: string;
  page?: number;
  limit?: number;
}

export const CancelReservationSchema = z.object({
  id: z.string().uuid("Invalid reservation id")
});

export type TCancelReservation = z.infer<typeof CancelReservationSchema>;

export const PaginationsSchema = z.object({
  currentPage: z.number().int().min(1, "Current page must be at least 1").optional(),
  totalPages: z.number().int().min(1, "Total pages must be at least 1").optional(),
  baseUrl: z.string().trim().url("Invalid base url").optional(),
  queryParams: z.record(z.string().trim()).optional()
})

export type TPaginationProps = z.infer<typeof PaginationsSchema>;

export const AddRestaurantSchema = z.object({
  restaurant_name: z.string().trim().min(8, "Restaurant name must be at least 8 character").max(64, "Restaurant name must be at most 64 characters"),
  restaurant_address: z.string().trim().min(8, "Restaurant address must be at least 8 character").max(64, "Restaurant address must be at most 64 characters"),
  restaurant_contact: z.string().trim().min(8, "Contact number is invalid").max(15, "Contact number is invalid"),
});

export type AddRestaurant = z.infer<typeof AddRestaurantSchema>;