"use client";
import { useState, useEffect } from "react";
import { Button } from "@tremor/react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddRole() {
  const router = useRouter();
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleUser = async (e: any) => {
    // reset error and message
    setError("");
    setMessage("");

    // fields check
    if (!name) return setError("All fields are required");

    // user structure
    let role = {
      name,
    };

    let response = await fetch("/api/user/addrole", {
      method: "POST",
      body: JSON.stringify(role),
    });

    // // get the data
    let data = await response.json();

    if (response.status === 429) {
      toast.error("Quota exceeded", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    if (data?.data.status === "new") {
      // reset the fields
      setName("");

      toast.success("Success", {
        position: "top-right",
        autoClose: 1000,
      });
      // Refresh page after new User
      router.refresh();
    } else {
      toast.error(
        "Oups, etwas ist schief gelaufen, bitte probieren Sie es noch einmal oder kontaktieren Sie uns.",
        {
          position: "top-right",
          autoClose: 1000,
        }
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-12 bg-white dark:bg-gray-900">
        <div className="relative z-0">
          <div className="px-4 mx-auto mb-12 max-w-7xl sm:px-6 lg:px-8">
            <div className="relative lg:grid lg:grid-cols-7">
              <div className="max-w-md mx-auto lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3"></div>
              <div className="max-w-lg mx-auto mt-10 lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
                <div className="relative z-10 rounded-lg shadow-xl">
                  <div
                    className="absolute inset-0 border-2 border-indigo-600 rounded-lg pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 top-0 transform translate-y-px">
                    <div className="flex justify-center transform -translate-y-1/2">
                      <span className="inline-flex px-4 py-1 text-base font-semibold text-white bg-indigo-600 rounded-full">
                        Role
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pt-12 pb-10 bg-white rounded-t-lg dark:bg-gray-900">
                    <div className="mt-4 sm:flex sm:max-w-md">
                      <label className="sr-only">Name</label>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={name}
                        id="name"
                        required
                        className="w-full min-w-0 px-4 py-2 text-base  placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:placeholder-gray-400"
                      />
                    </div>
                    <Button
                      disabled={!name}
                      size="md"
                      className="mt-4 sm:flex sm:max-w-md"
                      onClick={handleUser}
                    >
                      {t("user.addrole")}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="max-w-md mx-auto mt-10 lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
