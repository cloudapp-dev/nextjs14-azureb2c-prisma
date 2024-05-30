export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTranslation } from "@/app/i18n/server";
// import Chart from "../../../components/dashboard/chart.component";
import type { LocaleTypes } from "@/app/i18n/settings";
import Sidebar from "@/components/sidebar/dashboard/sidebar.component";

export default async function Dashboard({
  params: { locale },
  searchParams,
}: {
  params: { locale: LocaleTypes };
  searchParams: { q: string };
}) {
  const search = searchParams.q ?? "";

  const session = await getServerSession(authOptions);
  const { t } = await createTranslation(locale, "common");
  const user = session?.user;
  const role = session?.role;

  if (role !== "Admin") {
    return (
      <>
        <div>Not authenticated...</div>
      </>
    );
  }

  return (
    <main className="p-4 mx-auto md:p-10 max-w-7xl">
      {/* Sidebar */}
      <Sidebar />
      {/* <Chart /> */}
    </main>
  );
}
