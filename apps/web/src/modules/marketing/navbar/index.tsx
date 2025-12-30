import { Logo } from "@exec0/ui/assets";
import { Button } from "@exec0/ui/button";
import { Link } from "next-view-transitions";
import ModeToggle from "@/components/mode-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background z-50 border py-1 mx-4 mt-4">
      <div className="px-6 flex items-center justify-between">
        <ul className="flex gap-6 items-center py-0.5">
          <div className="font-semibold text-lg flex items-center gap-2.5">
            <Logo className="size-8" />
            Exec0
          </div>
          <li>
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button variant="default" size="sm">
            SignUp
          </Button>
        </div>
      </div>
    </nav>
  );
}
