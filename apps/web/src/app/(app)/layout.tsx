import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCachedSession();
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}
