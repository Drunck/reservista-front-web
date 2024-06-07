"use client";

import AdminPanelSideMenu from "./admin-panel-side-menu";



export default function layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="lg:mt-14 flex flex-row">
      <AdminPanelSideMenu />
      <div className="ml-80 w-full pr-4">
        {children}
      </div>
    </div>
  )
}
