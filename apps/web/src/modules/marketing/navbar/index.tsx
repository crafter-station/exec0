import { Logo } from "@exec0/ui/assets";
import { Link } from "next-view-transitions";
import { NavbarButtons } from "./navbar-buttons";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background z-50 border py-1 mx-4 mt-4">
      <div className="px-6 flex items-center justify-between">
        <ul className="flex gap-6 items-center py-1">
          <div className="font-semibold text-lg flex items-center gap-2.5">
            <Logo size="28px" className=" logo" />
            {/*Exec0*/}
          </div>
          <li>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary text-sm"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary text-sm"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary text-sm"
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <NavbarButtons />
        </div>
      </div>
    </nav>
  );
}
