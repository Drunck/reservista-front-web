"use client";

import { Auth, AuthContextType } from "@/lib/types";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<Auth>({ isAuth: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/api/auth/validate", {
          method: "POST",
          credentials: "include",
        });
        
        const data = await response.json();
        if (data.status === "ok") {
          setAuth({ isAuth: true, user_id: data.user.id, user_roles: data.user.roles });
        } else if (data.status === "error") {
          setAuth({ isAuth: false });
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
    }
  }, [auth.isAuth, auth.user_id, auth.user_roles]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;