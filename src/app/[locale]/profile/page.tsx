export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTranslation } from "@/app/i18n/server";
import { LocaleTypes } from "@/app/i18n/settings";

interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: PageParams;
}

export default async function Profile({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  return (
    <>
      <section className="min-h-screen pt-20 bg-ct-blue-600">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <div>
            <h1 className="mb-3 text-5xl font-semibold text-center">
              {t("pages.profile")}
            </h1>
            {!user ? (
              <p>Loading...</p>
            ) : (
              <div className="flex items-center gap-8">
                <div></div>
                <div className="mt-8">
                  <p className="mb-3">Name: {user.name}</p>
                  <p className="mb-3">Email: {user.email}</p>
                  <p className="mb-3">Rolle: {session?.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
