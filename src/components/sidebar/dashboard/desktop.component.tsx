import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";
import type { LocaleTypes } from "@/app/i18n/settings";

import { SlHome } from "react-icons/sl";
import { BsInfoSquare, BsChatDots } from "react-icons/bs";
import { FaTshirt, FaRedhat } from "react-icons/fa";

export default function MenuBarDesktop({ show, setter }: any) {
  const locale = useParams()?.locale as LocaleTypes;
  const pathname = usePathname();
  const { t } = useTranslation(locale, "common");

  // Define our base class
  const className =
    "dark:bg-gray-700 bg-gray-200  w-[150px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
  // Append class based on state of sidebar visiblity
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  // Clickable menu items
  const MenuItem = ({ icon, name, route }: any) => {
    // Highlight menu item based on currently displayed route
    const colorClass =
      pathname === route
        ? "dark:text-white text-black"
        : "dark:text-white/50 dark:hover:text-white text-black/50 hover:text-black";

    return (
      <a
        href={route}
        onClick={() => {
          setter((oldVal: any) => !oldVal);
        }}
        className={`flex gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-white/10 ${colorClass}`}
      >
        <div className="text-xl flex [&>*]:mx-auto w-[30px]">{icon}</div>
        <div>{name}</div>
      </a>
    );
  };

  // Overlay to prevent clicks in background, also serves as our close button
  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setter((oldVal: any) => !oldVal);
      }}
    />
  );

  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="flex flex-col">
          <MenuItem
            name={t("sidebar.home")}
            route={`/${locale}/dashboard`}
            icon={<SlHome />}
          />
          <MenuItem
            name={t("sidebar.user")}
            route={`/${locale}/dashboard/user`}
            icon={<FaTshirt />}
          />
          <MenuItem
            name={t("sidebar.activities")}
            route={`/${locale}/dashboard/activities`}
            icon={<BsInfoSquare />}
          />
        </div>
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
