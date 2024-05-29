import React from "react";

export default function UserPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      {children}
    </div>
  )
}

