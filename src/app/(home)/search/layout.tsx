import React from "react";

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="py-16 px-4 lg:py-0">
      {children}
    </div>
  )
}
