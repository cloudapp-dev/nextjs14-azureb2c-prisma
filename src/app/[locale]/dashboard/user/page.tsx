export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTranslation } from "@/app/i18n/server";
import prisma from "@/lib/prisma";
import { Card, Metric, Text, Title, BarList, Flex, Grid } from "@tremor/react";
import type { LocaleTypes } from "@/app/i18n/settings";
import Search from "@/components/dashboard/search.component";
import RolesTable from "@/components/dashboard/rolestable.component";
import PromoteRole from "@/components/user/promoteUser.component";
import AddRole from "@/components/user/addroleUI.component";
import Sidebar from "@/components/sidebar/dashboard/sidebar.component";

export default async function User({
  params: { locale },
  searchParams,
}: {
  params: { locale: LocaleTypes };
  searchParams: { q: string };
}) {
  const getRoles = await prisma.roles.findMany({
    orderBy: {
      addedOn: "desc",
    },
  });

  const search = searchParams.q ?? "";

  const session = await getServerSession(authOptions);
  const { t } = await createTranslation(locale, "common");
  const role = session?.role;

  if (role !== "Admin") {
    return (
      <>
        <div>Loading or not authenticated...</div>
      </>
    );
  }

  const roles = await prisma.roles.findMany({
    where: { name: { contains: `${search}` } },
    orderBy: {
      name: "desc",
    },
  });

  return (
    <main className="p-4 mx-auto md:p-10 max-w-7xl">
      <Sidebar />
      <AddRole />
      <div className="pb-4">
        <Title>{t("user.roles")}</Title>
        <Text>{t("user.searchforroles")}</Text>
        <Search />
        <Card className="mt-6">
          <RolesTable roles={roles} />
        </Card>
      </div>
      <PromoteRole
        roles={getRoles}
        b2cextensionuser={process.env.AZURE_B2C_EXTENSION_USER || ""}
        tld={process.env.NEXTAUTH_URL || ""}
      />
    </main>
  );
}
