import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background z-50 border py-1 mx-4 mt-4">
      <div className="px-4 py-0.5 flex items-center justify-between">
        <ul className="flex gap-6">
          <div className="font-bold">Logo</div>
          <li>
            <a href="/" className="text-muted-foreground hover:text-primary">
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="text-muted-foreground hover:text-primary"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/contact"
              className="text-muted-foreground hover:text-primary"
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">SignUp</Button>
        </div>
      </div>
    </nav>
  );
}
