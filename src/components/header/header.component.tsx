import Navbar from "@/components/header/navbar.component";
import SearchBar from "./search.component";
import { Suspense } from "react";

interface HeaderProps {
  showBar: boolean;
  menuItems: any;
  logourl: string;
}

export default function Header({ showBar, menuItems, logourl }: HeaderProps) {
  return (
    <header>
      {/* <DarkModeButton /> */}
      {/* <NavbarBanner /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar menuItems={menuItems} logourl={logourl} />
      </Suspense>
      {showBar && (
        <SearchBar
          searchCta="Search"
          searchPlaceholder="Search example.dev..."
        />
      )}
    </header>
  );
}
