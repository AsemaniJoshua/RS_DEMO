"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "medication-review",
    title: "Comprehensive Medication Review",
    duration: "45 mins",
    price: "$75",
    description: "A detailed review of all your medications to ensure safety, effectiveness, and minimal side effects.",
    icon: Calendar,
  },
  {
    id: "diabetes-consult",
    title: "Diabetes Management Consultation",
    duration: "60 mins",
    price: "$100",
    description: "Personalized advice on diet, lifestyle, and medication to help you manage your blood sugar levels.",
    icon: Video,
  },
  {
    id: "supplement-consult",
    title: "Supplement Strategy Session",
    duration: "30 mins",
    price: "$50",
    description: "Expert guidance on selecting the right supplements for your specific health goals.",
    icon: Clock,
  },
  {
    id: "weight-loss",
    title: "Weight Loss Coaching",
    duration: "60 mins",
    price: "$90",
    description: "Evidence-based strategies to help you achieve and maintain a healthy weight.",
    icon: Video,
  },
];

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-muted/30 py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary mb-4">
            Book an Appointment
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
            Schedule a virtual consultation with Dr. George to discuss your health concerns in a private, professional setting.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col p-6 bg-background border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-primary">{service.price}</div>
                    <div className="text-xs text-muted-foreground">{service.duration}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-1">
                  {service.description}
                </p>
                <Button className="w-full">
                  Select Time
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendly Embed Placeholder */}
      <section className="py-20 bg-muted/20">
        <div className="container px-4 md:px-6 text-center">
           <h2 className="text-2xl font-bold mb-8">Select a Date & Time</h2>
           <div className="max-w-3xl mx-auto bg-background border rounded-xl h-[600px] flex items-center justify-center shadow-sm">
              <p className="text-muted-foreground">Calendly Embed Widget will load here...</p>
           </div>
        </div>
      </section>
    </div>
  );
}
