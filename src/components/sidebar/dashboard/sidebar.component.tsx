"use client";
import { useState } from "react";
import MenubarDesktop from "./desktop.component";
import MenuBarMobile from "./mobile.component";

export default function Sidebar() {
  // Mobile sidebar visibility state
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <div className="mb-5">
        <div className="flex">
          <MenuBarMobile setter={setShowSidebar} />
          <MenubarDesktop show={showSidebar} setter={setShowSidebar} />
        </div>
      </div>
    </>
  );
}
