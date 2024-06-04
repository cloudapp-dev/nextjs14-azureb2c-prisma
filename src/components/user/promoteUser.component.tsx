"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

import {
  Text,
  Title,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  created: string;
}

interface Role {
  id: number;
  name: string;
  addedOn: Date;
}

let b2cextensionuservalue: string | unknown = "";

const PromoteRole = ({
  roles,
  b2cextensionuser,
  tld,
}: {
  roles: Role[];
  b2cextensionuser: string;
  tld: string;
}) => {
  const [usercomplete, setUsercomplete] = useState<User[]>([]);
  const [time, setTime] = useState(Date.now());
  const [value, setValue] = useState("");
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

  const ChangeHandler = (e: any) => {
    let role = e.target.value;
    // console.log("role:", role);
    setValue(role);
  };

  const ondelete = async (id: string) => {
    // fields check

    let response = await fetch("/api/azure/user/delete?userid=" + id);

    // // get the data
    let data = response.status;

    console.log("data:", data);

    if (data === 204) {
      // reset the fields

      toast.success("Deleted", {
        position: "top-right",
        autoClose: 1000,
      });
      //Set Time to trigger UseEffect
      setTime(Date.now());
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

  const onpromote = async (id: string, role: string) => {
    // user structure
    let user = {
      id,
      role,
    };

    if (!role) return toast.error(t("user.rolemissing"), { autoClose: 1000 });

    let response = await fetch("/api/user/promote", {
      method: "POST",
      body: JSON.stringify(user),
    });

    let data = response.status;

    if (data === 204) {
      toast.success(t("user.changedto") + " " + role, {
        position: "top-right",
        autoClose: 1000,
      });
      // reset the fields
      setValue("");

      setTime(Date.now());
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

  useEffect(() => {
    // let ignore = false;
    const fetchUsers = async () => {
      const response = await fetch("/api/azure/user", {
        method: "GET",
      });

      // // get the data
      let data = await response.json();

      //   Value aus dem Array holen
      const users = data.data.value;

      // console.log("users:", users);

      const usercompletenew: any[] = [];

      users.forEach((user: any) => {
        b2cextensionuservalue = "";

        Object.entries(user).forEach((entry) => {
          const [key, value] = entry;
          if (key === b2cextensionuser) {
            // console.log(`${key}: ${value}`);
            b2cextensionuservalue = value || "";
          }
        });
        // console.log("b2cextensionuservalue:", b2cextensionuservalue);
        usercompletenew.push({
          id: user.id,
          name: user.displayName,
          role: b2cextensionuservalue,
          email:
            user.identities[0].signInType === "emailAddress"
              ? user.identities[0].issuerAssignedId
              : user.otherMails[0],
          created: user.createdDateTime,
        });
      });

      setUsercomplete(usercompletenew);
    };

    fetchUsers();
  }, [time, b2cextensionuser]);

  return (
    <>
      <ToastContainer />
      <Title>{t("search.dashboardsearchhighline")}</Title>
      <Text>{t("search.dashboardsearchdescription")}</Text>
      <Table className="mt-4 border border-gray-700 rounded-md">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>{t("user.role")}</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>{t("user.createdat")}</TableHeaderCell>
            <TableHeaderCell>Role Selection</TableHeaderCell>
            <TableHeaderCell>{t("user.actions")}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usercomplete.map((datauseritem: User, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Text>{datauseritem.name}</Text>
              </TableCell>
              <TableCell>
                <Text>{datauseritem.role}</Text>
              </TableCell>
              <TableCell>
                <Text>{datauseritem.email}</Text>
              </TableCell>
              <TableCell>
                <Text>{datauseritem.created}</Text>
              </TableCell>
              <TableCell>
                <select
                  id={index.toString()}
                  className="bg-gray-500 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:bg-gray-600 hover:border-gray-700"
                  onChange={(e) => ChangeHandler(e)}
                >
                  <option value="">{t("user.selectrole")}</option>
                  {roles.map((role: Role, index: number) => (
                    <option key={index} value={role.name || ""}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="primary"
                  color="gray"
                  onClick={() => onpromote(datauseritem.id, value)}
                >
                  {t("user.promoteadmin")}
                </Button>
              </TableCell>
              {/* Delete user */}
              <TableCell>
                <Button
                  size="sm"
                  variant="primary"
                  color="gray"
                  onClick={() => ondelete(datauseritem.id)}
                >
                  {t("user.deleteuser")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PromoteRole;
