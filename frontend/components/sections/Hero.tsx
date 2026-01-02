"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";

const CheckBadgeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Animated counter component
function AnimatedStat({ value, label }: { value: string; label: string }) {
    const { ref, isInView } = useInView();
    
    // Parse numeric value from string like "10K+", "500+", "15+"
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.match(/[^0-9]+$/)?.[0] || '';
    const prefix = value.match(/^[^0-9]+/)?.[0] || '';
    
    const count = useCountUp({ 
        end: numericValue,
        duration: 2000,
        trigger: isInView
    });

    return (
        <div ref={ref}>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {prefix}{count}{suffix}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">{label}</div>
        </div>
    );
}

export default function Hero() {
    const stats = [
        { value: "10K+", label: "Happy Patients" },
        { value: "15+", label: "Years Experience" },
        { value: "500+", label: "Resources" },
        { value: "50+", label: "Expert Topics" },
    ];

    return (
        <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/10 mb-8">
                            <CheckBadgeIcon />
                            <span className="text-sm font-medium text-teal-300">Trusted Healthcare Expert</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Empowering Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00a8cc]">
                                Health Journey
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                            Expert guidance in drug safety, disease prevention, and personalized telepharmacy services. Your trusted partner for evidence-based health education.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-10 sm:mb-16">
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-gradient-to-r from-[#0066ff] to-[#00ccff] hover:from-[#0052cc] hover:to-[#00b8e6] shadow-lg shadow-blue-500/30"
                                onClick={() => window.location.href = '/booking'}
                            >
                                Book a Professional
                                <ArrowRightIcon />
                            </Button>
                            <button 
                                className="px-8 h-12 rounded-full border-2 border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-200"
                                onClick={() => window.location.href = '/products'}
                            >
                                Explore Resources
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 pt-10 mt-10 sm:mt-0 sm:pt-6 sm:ml-16 border-t border-white/10">
                            {stats.map((stat, index) => (
                                <AnimatedStat 
                                    key={index} 
                                    value={stat.value} 
                                    label={stat.label} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-[300px] sm:h-[400px] lg:h-[600px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-blue-600/10 rounded-3xl"></div>
                        <Image
                            src="/dr-george.png"
                            alt="Professional Healthcare Expert - Dr. George"
                            fill
                            className="object-cover rounded-3xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
