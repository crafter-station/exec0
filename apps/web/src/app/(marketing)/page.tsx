import DiagonalDivider from "@/components/divider";
import FeaturesSection from "@/modules/marketing/features";
import Hero from "@/modules/marketing/hero";

export default function Home() {
  return (
    <div>
      <div className="px-5">
        <DiagonalDivider />
      </div>
      <Hero />
      <div className="px-5">
        <DiagonalDivider />
      </div>
      <FeaturesSection />
    </div>
  );
}
