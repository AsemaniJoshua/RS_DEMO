import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, PlayCircle, BookOpen, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Your Health, <br />
                  Expertly Managed.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Empowering you with expert pharmacy insights, digital health resources, and personalized consultations. Join Dr. George on a journey to better health.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/appointments">
                    Book a Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/store">
                    Explore Resources
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Licensed Pharmacist</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Expert Advice</span>
                </div>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[500px] lg:order-last overflow-hidden rounded-2xl shadow-xl">
               {/* Placeholder for Dr. George's Image - Using a generic medical image or the logo if no photo available yet */}
               <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
                  <Image
                    src="/logo.png"
                    alt="Dr. George"
                    fill
                    className="object-cover opacity-20"
                  />
                  <span className="z-10 text-lg font-medium">Dr. George's Photo</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Digital Resources</h3>
              <p className="text-muted-foreground">
                Access a library of eBooks, courses, and guides on drug safety, supplements, and disease management.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <PlayCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Video Library</h3>
              <p className="text-muted-foreground">
                Watch expert explainer videos, media appearances, and health tips directly from Dr. George.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-xl shadow-sm border">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Virtual Consultations</h3>
              <p className="text-muted-foreground">
                Book one-on-one sessions for medication reviews, diabetes management, and weight loss consulting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Preview (Placeholder) */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Latest Updates</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Stay informed with the latest articles, videos, and resources.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-shadow hover:shadow-md">
                <div className="aspect-video w-full bg-muted" />
                <div className="p-6">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                    Understanding Drug Safety {i}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A comprehensive guide to keeping your family safe...
                  </p>
                  <Link href="#" className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/blog">View All Content</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="max-w-[600px] mx-auto text-primary-foreground/90 md:text-xl mb-8">
            Schedule a consultation today and get personalized advice tailored to your needs.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/appointments">Book an Appointment</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
