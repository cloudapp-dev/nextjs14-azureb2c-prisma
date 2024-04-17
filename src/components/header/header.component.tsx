import Navbar from "@/components/header/navbar.component";
import SearchBar from "./search.component";

interface HeaderProps {
  showBar: boolean;
  menuItems: any;
}

export default function Header({ showBar, menuItems }: HeaderProps) {
  return (
    <header>
      {/* <DarkModeButton /> */}
      {/* <NavbarBanner /> */}
      <Navbar menuItems={menuItems} />
      {showBar && (
        <SearchBar
          searchCta="Search"
          searchPlaceholder="Search example.dev..."
        />
      )}
    </header>
  );
}
