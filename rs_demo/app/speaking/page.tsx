"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Mic2, Users } from "lucide-react";
import Image from "next/image";

export default function SpeakingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">
            Speaking & Consulting
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
            Inspire your audience with expert insights on healthcare, drug safety, and wellness.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">Why Book Dr. George?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dr. George brings a unique blend of clinical expertise and relatable storytelling. Whether it's a corporate wellness event, a medical conference, or a community workshop, he delivers engaging and actionable content.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Signature Topics</h3>
                <ul className="space-y-3">
                  {[
                    "Navigating the Complex World of Supplements",
                    "The Opioid Crisis: Prevention Starts at Home",
                    "Diabetes: Lifestyle as Medicine",
                    "Future of Pharmacy: Digital Health Trends"
                  ].map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg w-32">
                   <Users className="h-8 w-8 text-primary mb-2" />
                   <span className="font-bold text-2xl">50+</span>
                   <span className="text-xs text-muted-foreground">Events</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg w-32">
                   <Mic2 className="h-8 w-8 text-primary mb-2" />
                   <span className="font-bold text-2xl">10k+</span>
                   <span className="text-xs text-muted-foreground">Audience</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Inquire for Booking</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input id="name" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input id="email" type="email" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="org" className="text-sm font-medium">Organization</label>
                  <input id="org" className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Company / Event Name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">Event Type</label>
                  <select id="type" className="w-full rounded-md border px-3 py-2 text-sm bg-background">
                    <option>Conference Keynote</option>
                    <option>Corporate Workshop</option>
                    <option>Panel Discussion</option>
                    <option>Media Interview</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea id="message" className="w-full rounded-md border px-3 py-2 text-sm min-h-[100px]" placeholder="Tell us about your event..." />
                </div>
                <Button type="submit" className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Send Inquiry
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
