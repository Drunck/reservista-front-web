"use client";

import useMediaQuery from '@/hooks/use-media-query';
import MobileNavBar from '@/ui/components/mobile-navbar'
import NavBar from '@/ui/components/navbar'
import React from 'react'

export default function HomePageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  return (
    <>
      {isDesktop ? <NavBar /> : <MobileNavBar />}
      <main className="relative w-full  lg:mt-16 lg:max-w-6xl lg:mx-auto flex flex-col">
        {children}
      </main>
    </>
  )
}
