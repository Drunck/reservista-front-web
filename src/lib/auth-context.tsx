"use client";

import { TAuthContext } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/auth/validate", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        // console.log("DATA STATUS", data.status, "DATA USER ID", data.user_id)
        if (data.status === "ok") {
          setIsAuth(true);
          setUserId(data.user_id);
        } else if (data.status === "error") {
          // console.log("API Response Message token verification error", data.status, data.message);
          setIsAuth(false);
          setUserId("");
        }
      }
      // setIsAuth(response.ok && (await response.json()).status === "ok");
      // setIsLoading(false);
      catch (error) {
        console.error("Error checking token: ", error);
      } finally {
        setIsLoading(false);
      }
    };


    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, isLoading, userId, setIsAuth, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
