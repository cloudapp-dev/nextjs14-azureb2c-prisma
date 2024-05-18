import Navbar from "@/components/header/navbar.component";
import SearchBar from "./search.component";

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
      <Navbar menuItems={menuItems} logourl={logourl} />
      {showBar && (
        <SearchBar
          searchCta="Search"
          searchPlaceholder="Search example.dev..."
        />
      )}
    </header>
  );
}
