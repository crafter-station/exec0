import { PlaygroundChat } from "./playground-chat";

export default function PlaygroundSection() {
  return (
    <section className="px-4">
      <div className="mx-auto border">
        <div className="col-span-full border-b p-12">
          <p className="text-center text-4xl font-semibold lg:text-7xl">
            Try it now
          </p>
          <p className="mt-4 text-center text-muted-foreground text-lg">
            Watch an AI agent write and execute code in real-time
          </p>
        </div>
        <div className="p-6 md:p-12">
          <PlaygroundChat />
        </div>
      </div>
    </section>
  );
}
