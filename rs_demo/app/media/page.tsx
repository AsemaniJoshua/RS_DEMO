import { Button } from "@/components/ui/button";
import { Play, Mic, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MediaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">
            Media & Press
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
            Watch Dr. George's latest interviews, explainer videos, and press appearances.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-12">
            {/* Featured Video */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Play className="h-6 w-6 text-primary" /> Featured Video
              </h2>
              <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer">
                 {/* Placeholder for Video Embed */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                       <Play className="h-10 w-10 text-white fill-current" />
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h3 className="text-xl font-bold">How to Safely Manage Multiple Medications</h3>
                    <p className="text-sm opacity-80">Dr. George explains the importance of medication reviews.</p>
                 </div>
              </div>
            </div>

            {/* Recent Appearances Grid */}
            <div className="space-y-6">
               <h2 className="text-2xl font-bold flex items-center gap-2">
                <Newspaper className="h-6 w-6 text-primary" /> Recent Appearances
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video bg-muted relative">
                       <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <Image
                            src="/logo.png"
                            alt="Media Appearance"
                            fill
                            className="object-cover opacity-20"
                          />
                       </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Mic className="h-3 w-3" />
                        <span>Podcast Interview</span>
                      </div>
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        Discussing Youth Drug Trends on Health Talk {i}
                      </h3>
                      <Button variant="link" className="px-0 mt-2 h-auto">
                        Watch Segment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
           <h2 className="text-3xl font-bold mb-6">Want Dr. George on your show?</h2>
           <Button size="lg" variant="secondary" asChild>
             <Link href="/speaking">Request Media Kit</Link>
           </Button>
        </div>
      </section>
    </div>
  );
}
