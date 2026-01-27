import { auth } from "@exec0/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HeaderDashboard from "@/modules/dashboard/header";

export default async function LayoutDashboard({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = await headers();

  const session = await auth.api.getSession({ headers: h });

  if (!session) {
    redirect("/");
  }

  const organizations = await auth.api.listOrganizations({
    headers: h,
  });

  const org = organizations.find((o) => o.slug === slug);

  if (!org) {
    redirect("/");
  }

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="w-full max-w-3xl px-6">
        <div className="mt-8">
          <HeaderDashboard
            organizations={organizations}
            currentOrg={org}
            user={session.user}
          />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
