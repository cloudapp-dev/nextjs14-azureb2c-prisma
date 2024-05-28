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

interface Role {
  id: number;
  name: string;
  addedOn: Date;
}

export default function RolesTable({ roles }: { roles: Role[] }) {
  let intlDateObj = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Europe/Paris",
  });
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
