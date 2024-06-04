"use client";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
  Text,
} from "@tremor/react";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Role {
  id: number;
  name: string;
  addedOn: Date;
}

export default function RolesTable({ roles }: { roles: Role[] }) {
  const router = useRouter();
  let intlDateObj = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Europe/Paris",
  });
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

  const ondelete = async (id: number) => {
    // fields check
    // if (!id) return setError("All fields are required");

    // user structure
    let user = {
      id,
    };

    let response = await fetch("/api/user/deleterole", {
      method: "POST",
      body: JSON.stringify(user),
    });

    // // get the data
    let data = await response.json();

    if (data.data.status === "success") {
      // reset the fields

      toast.success("Deleted", {
        position: "top-right",
        autoClose: 1000,
      });
      // Refresh page after User deletion
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
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>{t("user.roles")}</TableHeaderCell>
            <TableHeaderCell>{t("user.createdat")}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role: Role) => (
            <TableRow key={role.id}>
              <TableCell>
                <Text>{role.name}</Text>
              </TableCell>
              <TableCell>
                <Text>{intlDateObj.format(role.addedOn)}</Text>
              </TableCell>
              <TableCell>
                <Button
                  size="xs"
                  variant="primary"
                  color="gray"
                  onClick={() => ondelete(role.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
