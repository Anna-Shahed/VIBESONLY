import SiteNav from "@/components/landing/SiteNav";
import Hero from "@/components/landing/Hero";
import { HowItWorks, MusicWall, Transform, FinalCta, Footer } from "@/components/landing/Sections";
import DemoSection from "@/components/landing/DemoSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-vibe-bg text-vibe-text overflow-x-hidden">
      <SiteNav />
      <Hero />
      <HowItWorks />
      <DemoSection />
      <MusicWall />
      <Transform />
      <FinalCta />
      <Footer />
    </main>
  );
}
