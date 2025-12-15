import Hero from "@/components/sections/Hero";
import TrustBadges from "@/components/sections/TrustBadges";
import Services from "@/components/sections/Services";
import WhyChoose from "@/components/sections/WhyChoose";
import Testimonials from "@/components/sections/Testimonials";
import FeaturedContent from "@/components/sections/FeaturedContent";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrustBadges />
      <Services />
      <WhyChoose />
      <Testimonials />
      <FeaturedContent />
      <FAQ />
      <CTA />
    </div>
  );
}
