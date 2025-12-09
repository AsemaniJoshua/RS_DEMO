import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, GraduationCap, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/30 py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary">
              About Dr. George
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Pharmacist, Health Consultant, and Advocate for Better Living.
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
             <div className="relative aspect-[3/4] w-full max-w-[400px] mx-auto overflow-hidden rounded-xl shadow-lg bg-muted">
               {/* Placeholder for Bio Image */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Image
                    src="/logo.png"
                    alt="Dr. George Portrait"
                    fill
                    className="object-cover opacity-20"
                  />
                  <span className="z-10 font-medium">Dr. George Portrait</span>
               </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">My Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                I am dedicated to bridging the gap between complex medical information and everyday understanding. With years of experience in clinical pharmacy, I strive to empower individuals to take charge of their health through education, personalized consultation, and accessible resources.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My journey began with a passion for drug safety and has evolved into a comprehensive platform addressing diabetes management, supplement safety, and youth drug abuse prevention.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2 mt-8">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Doctor of Pharmacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-medium">Certified Consultant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="font-medium">Patient Advocate</span>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild>
                  <Link href="/speaking">
                    Book for Speaking <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials / Media Links */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
           <h2 className="text-3xl font-bold mb-12">Featured In</h2>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-80">
             {/* Placeholders for Media Logos */}
             {["TV Network", "Radio Station", "Health Magazine", "Podcast"].map((media) => (
               <div key={media} className="text-xl font-bold border-2 border-white/20 px-6 py-3 rounded-lg">
                 {media}
               </div>
             ))}
           </div>
           <div className="mt-12">
             <Button variant="secondary" asChild>
               <Link href="/media">View Media Appearances</Link>
             </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
