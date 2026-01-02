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
      <div className="fade-in"><TrustBadges /></div>
      <div className="slide-up"><Services /></div>
      <div className="fade-in"><WhyChoose /></div>
      <div className="slide-up"><Testimonials /></div>
      <div className="fade-in"><FeaturedContent /></div>
      <div className="slide-up"><FAQ /></div>
      <div className="scale-in"><CTA /></div>
    </div>
  );
}
