"use client";

import NavBar from "@/ui/custom-components/navbar";
import MobileNavBar from "@/ui/custom-components/mobile-navbar";
import { useEffect, useState } from "react";
import useMediaQuery from "@/lib/hooks/use-media-query";

export default function ResponsiveNavbar() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return isDesktop ? <NavBar /> : <MobileNavBar />;
}
