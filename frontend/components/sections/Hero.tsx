"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";

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

export default function Hero() {
    const stats = [
        { value: "10K+", label: "Happy Patients" },
        { value: "15+", label: "Years Experience" },
        { value: "500+", label: "Resources" },
        { value: "50+", label: "Expert Topics" },
    ];

    return (
        <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] overflow-hidden">
            <div className="mx-auto max-w-[1400px] px-8 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-white">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-400/10 mb-8">
                            <CheckBadgeIcon />
                            <span className="text-sm font-medium text-teal-300">Trusted Healthcare Expert</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Empowering Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00a8cc]">
                                Health Journey
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                            Expert guidance in drug safety, disease prevention, and personalized telepharmacy services. Your trusted partner for evidence-based health education.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-16">
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                            {stats.map((stat, index) => (
                                <div key={index}>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative lg:h-[600px] h-[400px]">
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
