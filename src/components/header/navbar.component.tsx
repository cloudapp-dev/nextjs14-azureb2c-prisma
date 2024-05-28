"use client";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DarkModeButton from "@/components/header/darkmode.component";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
// Authentication
import { signIn, useSession } from "next-auth/react";
// Internationalization
import { useTranslation } from "@/app/i18n/client";
import type { LocaleTypes } from "@/app/i18n/settings";
import {
  useRouter,
  usePathname,
  useParams,
  useSearchParams,
  useSelectedLayoutSegments,
} from "next/navigation";
import {
  GlobeAmericasIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface Linkitems {
  key: number;
  name: string;
  href: string;
}

export default function Navbar({ menuItems, logourl }: any) {
  // Internationalization
  const locale = useParams()?.locale as LocaleTypes;
  const pathname = usePathname();
  const currentRoute = pathname;
  const { t } = useTranslation(locale, "common");

  // Authentication
  const SIGN_OUT_URL = `https://${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME}.b2clogin.com/${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/${process.env.NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI}/${locale}`;

  const { data: session } = useSession();
  const user = session?.user;
  const role = session?.role;

  const { push } = useRouter();
  const router = useRouter();
  const urlSegments = useSelectedLayoutSegments();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}/`;

  async function handleLocaleChange(event: any) {
    const newLocale = event;

    // This is used by the Header component which is used in `app/[locale]/layout.tsx` file,
    // urlSegments will contain the segments after the locale.
    // We replace the URL with the new locale and the rest of the segments.
    router.push(`/${newLocale}/${urlSegments.join("/")}`);
  }

  async function logoutredirect() {
    const logoutfeedback = await fetch(
      "/api/auth/signout?callbackUrl=/api/auth/session",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: await fetch("/api/auth/csrf").then((rs) => rs.text()),
      }
    );

    // console.log(logoutfeedback);
    // console.log(SIGN_OUT_URL);
    push(SIGN_OUT_URL);
  }

  function NavigationLink({ href, name }: Linkitems) {
    return (
      <a
        href={href}
        className={
          currentRoute === href
            ? "border-indigo-500 text-gray-900 dark:text-indigo-500 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
            : "border-transparent text-gray-500 dark:text-gray-50 hover:border-gray-300 hover:text-gray-700 inline-flex items-center text-base px-1 pt-1 border-b-2 font-medium"
        }
      >
        {name}
      </a>
    );
  }

  function NavigationLinkDisclosure({ href, name }: Linkitems) {
    return (
      <Disclosure.Button
        as="a"
        href={href}
        className={
          currentRoute === href
            ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            : "border-transparent text-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:text-indigo-700 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
        }
      >
        {name}
      </Disclosure.Button>
    );
  }

  return (
    <Disclosure
      as="nav"
      className="px-2 py-2.5 dark:border-gray-700 dark:bg-gray-900 sm:px-4"
    >
      {({ open }) => (
        <>
          <div className="flex flex-wrap items-center justify-between mx-auto">
            <Link className="flex items-center" href={`/${locale}/`}>
              <Image
                className="block float-left w-auto h-12 lg:hidden dark:bg-blue-100"
                src={logourl ? logourl : "/images/svgrepo-com.svg"}
                alt="Testblog"
                width={48}
                height={48}
              />

              <Image
                className="hidden float-left w-auto h-12 lg:block dark:bg-blue-100"
                src={logourl ? logourl : "/images/svgrepo-com.svg"}
                alt="Testblog"
                width={48}
                height={48}
              />
            </Link>

            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              {/* Desktop View */}
              {menuItems.map((menuItem: any, index: number) => (
                <NavigationLink
                  key={index}
                  // href={menuItem.href}
                  href={`/${locale}${menuItem.href}`}
                  name={menuItem.name}
                />
              ))}
            </div>

            <div className="flex items-center justify-center flex-1 px-2 lg:ml-6 lg:justify-end">
              <DarkModeButton />

              {/* Language dropdown */}
              <Menu as="div" className="relative flex-shrink-0 ml-4">
                <div>
                  <Menu.Button className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">
                      {" "}
                      {t("user.languageswitcher")}
                    </span>
                    <GlobeAmericasIcon
                      className="w-8 h-8 hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 block w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => {
                            handleLocaleChange("en-US");
                          }}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          🇺🇸 {t("languages.en")}
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          onClick={() => {
                            handleLocaleChange("de-DE");
                          }}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          🇩🇪 {t("languages.de")}
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* Profile dropdown */}
              <Menu as="div" className="relative flex-shrink-0 ml-4">
                <div>
                  <Menu.Button className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    {(!user && (
                      <UserCircleIcon
                        className="w-8 h-8 hover:text-gray-500"
                        aria-hidden="true"
                      />
                    )) ||
                      (user && (
                        <UsersIcon
                          className="w-8 h-8 p-1 hover:text-gray-500"
                          aria-hidden="true"
                        />
                      ))}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 block w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {user && (
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href={`/${locale}/profile`}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {t("user.profile")}
                          </a>
                        )}
                      </Menu.Item>
                    )}
                    {role === "Admin" && (
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href={`/${locale}/dashboard`}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {t("pages.dashboard")}
                          </a>
                        )}
                      </Menu.Item>
                    )}
                    {user && (
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => {
                              logoutredirect();
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {t("user.logout")}
                          </a>
                        )}
                      </Menu.Item>
                    )}
                    {!user && (
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() =>
                              signIn("azure-ad-b2c", { callbackUrl })
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {t("user.login")}
                          </a>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            <div className="flex items-center lg:hidden">
              {/* Mobile menu button */}
              <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {/* Only show up in Mobile view */}
              {menuItems.map((menuItem: any, index: number) => (
                <NavigationLinkDisclosure
                  key={index}
                  // href={menuItem.href}
                  href={`/${locale}${menuItem.href}`}
                  name={menuItem.name}
                />
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
