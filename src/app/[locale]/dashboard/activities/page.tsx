export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTranslation } from "@/app/i18n/server";
import prisma from "@/lib/prisma";
import { Card, Text, Title, BarList, Flex, Grid } from "@tremor/react";
import type { LocaleTypes } from "@/app/i18n/settings";
import Search from "@/components/dashboard/search.component";
import LoginUsersTable from "@/components/dashboard/loginusertable.component";
import LoginUsersTableGroup from "@/components/dashboard/loginusertablegroup.component";
import Sidebar from "@/components/sidebar/dashboard/sidebar.component";

export default async function activities({
  params: { locale },
  searchParams,
}: {
  params: { locale: LocaleTypes };
  searchParams: { q: string };
}) {
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

  const loginusers = await prisma.logins.findMany({
    where: { email: { contains: `${search}` } },
    orderBy: {
      lastLogin: "desc",
    },
    take: 15,
  });

  const groupusers: any = await prisma.logins.groupBy({
    by: ["email"],
    _sum: {
      logins: true,
    },
  });

  return (
    <main className="p-4 mx-auto md:p-10 max-w-7xl">
      <Sidebar />
      <div className="pb-4">
        <Title>{t("search.dashboardsearchhighline")}</Title>
        <Text>{t("search.dashboardsearchdescription")}</Text>
        <Search />
        <Card className="mt-6">
          <LoginUsersTable loginusers={loginusers} />
        </Card>
        <Title className="mt-6">Logins groupd by Users</Title>
        <Card className="mt-6">
          <LoginUsersTableGroup loginusersgroup={groupusers} />
        </Card>
      </div>
    </main>
  );
}
