import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password must be at most 64 characters").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).*$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export type TSignIn = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(1, "First name must be at least 1 characters").max(64, "First name must be at most 64 characters"),
  surname: z.string().min(1, "Last name must be at least 1 characters").max(64, "Last name must be at most 64 characters"),
  phone: z.string().min(12, "Phone number must be at least 12 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password must be at most 64 characters").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).*$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

export type TSignUp = z.infer<typeof SignUpSchema>;

export const ActivationCodeSchema = z.object({
  Code: z.string().length(6, "Activation code must be 6 characters")
});

export type TActivationCode = z.infer<typeof ActivationCodeSchema>;

export type TUser = {
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

export type TReservation = {
  id: string;
  table: {
    id: string;
    NumberOfSeats: number;
    IsReserved: boolean;
    TableNumber: number;
    restaurant: {
      id: string;
      name: string;
      address: string;
      contact: string;
    };
  };
  reservationTime: string;
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

export type ReservationInput = {
  user_id: string;
  table_id: string;
  reservation_time: string;
}

export type TResponse = {
  status: number;
  message: string;
}

export type TAPIRestaurantResponse = TResponse & {
  data: TRestaurant[]
}

export type TRestaurantReservationsResponse = TResponse & {
  data: {
    reservations?: TReservation[];
  }
}


export type FetchState = "loading" | "error" | "success";

export const times = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"];

export type ReponsiveDrawerDialogProps = {
  title: string;
  description?: string;
  triggerButtonText: string;
  triggerButtonOption?: string;
  closeButtonText: string;
  children: React.ReactNode;
}

export type MobileSideBarProps = {
  children: React.ReactNode;
}