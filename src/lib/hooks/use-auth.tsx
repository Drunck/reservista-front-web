import { useContext } from "react";
import { AuthContext } from "@/lib/context/auth-provider";

export default function useAuth() {
  return useContext(AuthContext);
};