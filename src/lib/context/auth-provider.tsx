"use client";

import { Auth, AuthContextType } from "@/lib/types";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({ isAuth: false });
  const [isLoading, setIsLoading] = useState(true);
  const internalApiUrl = process.env.NEXT_PUBLIC_DEV_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${internalApiUrl}/api/auth/validate`, {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();
        if (data.status === "ok") {
          setAuth({ isAuth: true, user_id: data.user.id, user_roles: data.user.roles });
        } else if (data.status === "error") {
          setAuth({ isAuth: false, user_id: undefined, user_roles: undefined });
        }
      }
      catch (error) {
        console.error("Error while checking token: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.isAuth === false || auth.user_id === undefined || auth.user_roles === undefined) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [auth.isAuth, auth.user_id, auth.user_roles, internalApiUrl]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;