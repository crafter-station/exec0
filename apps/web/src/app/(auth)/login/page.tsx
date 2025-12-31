"use client";
import { GithubIcon, Google, Logo, VercelIcon } from "@exec0/ui/assets";
import { Badge } from "@exec0/ui/badge";
import { Button } from "@exec0/ui/button";
import { Link } from "next-view-transitions";
import { useState } from "react";
import Silk from "@/modules/auth/silk";
import { authClient } from "@exec0/auth/client";
import { toast } from "sonner";
import { Spinner } from "@exec0/ui/components/spinner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      {/* Left side */}
      <div className="relative w-1/2 flex items-center justify-center border m-2 overflow-hidden">
        <div className="absolute top-3 left-3 z-20">
          <Link href="/">
            <Logo className="size-8 [&_path]:fill-white logo" />
          </Link>
        </div>
        <div className="absolute inset-0 z-0">
          <Silk
            speed={5}
            scale={0.7}
            color="#515152"
            noiseIntensity={3.4}
            rotation={0}
          />
        </div>
        <h1 className="relative z-10 text-xl text-muted-foreground font-medium text-center px-8">
          We've been looking for a product like Exec0 for a really long time -
          code executions that's simple and developer-focused.
        </h1>
      </div>

      {/* Right side */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-4 px-12 relative ">
        <h1 className="text-xl font-mono font-medium">Welcome to Exec0</h1>
        <p className="text-muted-foreground mb-7">
          Sign in or create an account
        </p>
        <Button className="w-90">
          <Google />
          Continue with Google
        </Button>
        <Button className="w-90">
          <GithubIcon />
          Continue with GitHub
        </Button>
        <div className="relative w-90">
          <Button
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await authClient.signIn.social(
                {
                  provider: "vercel",
                  callbackURL: "/dashboard",
                },
                {
                  onRequest: () => setLoading(true),
                  onResponse: () => setLoading(false),
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                  onSuccess: () => setLoading(false),
                },
              );
            }}
          >
            {!loading && <VercelIcon className="fill-background size-6" />}
            {loading ? <Spinner /> : "Continue with Vercel"}
          </Button>

          <Badge variant="outline" className="absolute -top-2 -right-2">
            Last used
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground text-center absolute bottom-8">
          By signing up you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
