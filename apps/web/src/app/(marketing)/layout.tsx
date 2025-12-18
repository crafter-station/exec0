import { Navbar } from "@/modules/marketing/navbar";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="mt-15.5">{children}</div>
    </div>
  );
}
