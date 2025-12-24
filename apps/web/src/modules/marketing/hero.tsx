"use client";

import { Button } from "@exec0/ui/button";
import dynamic from "next/dynamic";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { TextEffect } from "@/components/ui/text-effect";

// Lazy load GameOfLife sin SSR
const GameOfLife = dynamic(() => import("./background"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
});

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function Hero() {
  return (
    <main className="overflow-hidden border mx-4 bg-background">
      <section className="relative">
        <div className="absolute inset-0">
          <GameOfLife />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="py-22 md:py-44 sm:mx-auto lg:mr-auto lg:mt-0">
            <TextEffect
              preset="fade-in-blur"
              speedSegment={0.3}
              as="h1"
              className="max-w-2xl text-pretty text-5xl font-medium md:text-6xl"
            >
              Code runner for Agents and Humans
            </TextEffect>
            <TextEffect
              per="line"
              preset="fade-in-blur"
              speedSegment={0.3}
              delay={0.5}
              as="p"
              className="mt-8 max-w-2xl text-pretty text-muted-foreground text-lg"
            >
              Fast, Secure, and Elastic Infrastructure to Execute and Scale
              AI-Generated Code Safely.
            </TextEffect>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                item: transitionVariants.item,
              }}
              className="mt-12 flex items-center gap-2"
            >
              <Button>Start building</Button>
              <Button variant="ghost">Request a demo</Button>
            </AnimatedGroup>
          </div>
        </div>
      </section>
    </main>
  );
}
