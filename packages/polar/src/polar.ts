import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Timer {
  private start = performance.now();

  delta(): number {
    const delta = Math.round((performance.now() - this.start) / 500) * 500;
    return Math.max(delta, 1000);
  }
}

async function ingest(customerId: string, deltaMs: number): Promise<void> {
  const units = deltaMs / 500;
  console.log(`${customerId}: ${deltaMs}ms (${units} units)`);

  await polar.events.ingest({
    events: [
      {
        name: "execution-times",
        externalCustomerId: customerId,
        metadata: { deltaTime: deltaMs, units },
      },
    ],
  });
}

async function main(): Promise<void> {
  const t1 = new Timer();
  await sleep(100);
  await ingest("cus_123", t1.delta());

  const t2 = new Timer();
  await sleep(980);
  await ingest("cus_456", t2.delta());

  const t3 = new Timer();
  await sleep(1520);
  await ingest("cus_789", t3.delta());

  const t4 = new Timer();
  await sleep(1920);
  await ingest("cus_889", t4.delta());

  const t5 = new Timer();
  await sleep(3520);
  await ingest("cus_989", t5.delta());
}

main().catch(console.error);
