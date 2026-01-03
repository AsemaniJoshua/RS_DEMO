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
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                {prefix}{count}{suffix}
            </div>
            <div className="text-sm text-gray-300 font-medium">{label}</div>
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
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/dr-george.png"
                    alt="Professional Healthcare Expert - Dr. George"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
            </div>

            {/* Creative Overlay Layer - Strengthened for text readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/80 to-transparent"></div>
            
            {/* Content Layer */}
            <div className="relative z-20 mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 py-20 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left Column: Text & CTA */}
                    <div className="max-w-2xl text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-400/30 bg-teal-500/10 backdrop-blur-xs mb-8">
                            <CheckBadgeIcon />
                            <span className="text-sm font-medium text-teal-300">Trusted Healthcare Expert</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white tracking-tight">
                            Empowering Your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00a8cc]">
                                Health Journey
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed max-w-xl">
                            Expert guidance in drug safety, disease prevention, and personalized telepharmacy services. Your trusted partner for evidence-based health education.
                        </p>

                        {/* CTA Buttons - Left Aligned */}
                        <div className="flex flex-wrap gap-4 mb-16 justify-start">
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-gradient-to-r from-[#0066ff] to-[#00ccff] hover:from-[#0052cc] hover:to-[#00b8e6] shadow-lg shadow-blue-500/30 border-0 px-8 py-4 text-lg"
                                onClick={() => window.location.href = '/booking'}
                            >
                                Book a Consultation
                                <ArrowRightIcon />
                            </Button>
                            <button 
                                className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 transition-all duration-200 text-lg"
                                onClick={() => window.location.href = '/products'}
                            >
                                Explore Resources
                            </button>
                        </div>

                        {/* Stats - Left Aligned */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/10 pt-10">
                            {stats.map((stat, index) => (
                                <AnimatedStat 
                                    key={index} 
                                    value={stat.value} 
                                    label={stat.label} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: The Expertise Orbit */}
                    <div className="hidden lg:flex justify-end relative h-[600px] w-full items-center">
                        {/* 1. Atmospheric Glows - Calmer, Trustworthy Blue */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px]"></div>

                        {/* 2. Orbital Rings - Steady authoritative spin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>

                        {/* 3. The Expert Core - Central Hub */}
                        <div className="relative z-10 w-[300px] h-[300px] flex items-center justify-center">
                            {/* Spinning Border - Slow & Steady */}
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400/30 border-r-blue-500/30 animate-[spin_15s_linear_infinite]"></div>
                            
                            {/* Inner Glow */}
                            <div className="absolute inset-4 bg-[#0f172a] rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10">
                                <Image
                                    src="/dr-george.png"
                                    alt="Dr. George"
                                    fill
                                    className="object-cover scale-105"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60"></div>
                                
                                {/* Core Info */}
                                <div className="absolute bottom-6 left-0 right-0 text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">Dr. George</h3>
                                    <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Your Health Partner</p>
                                </div>
                            </div>
                        </div>

                        {/* 4. Orbiting Satellites - Trust Signals */}
                        
                        {/* Satellite 1: Patient Count (Top Right) */}
                        <div className="absolute top-[20%] right-[15%] z-20 animate-[float_8s_ease-in-out_infinite]">
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative flex items-center justify-center w-16 h-16 bg-[#1e293b]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                                    <span className="text-xl font-bold text-white">10K+</span>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-xs font-medium text-blue-200 backdrop-blur-sm border border-blue-500/20">Happy Patients</span>
                            </div>
                        </div>

                        {/* Satellite 2: Authority Badge (Bottom Left) */}
                        <div className="absolute bottom-[25%] left-[10%] z-20 animate-[float_7s_ease-in-out_infinite_1s]">
                            <div className="group flex items-center gap-3 px-5 py-3 bg-[#0f172a]/90 backdrop-blur-md rounded-full border border-teal-500/30 shadow-lg shadow-teal-500/10 cursor-default">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/20 text-teal-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Expertise</div>
                                    <div className="text-white font-bold text-sm">Medication Expert</div>
                                </div>
                            </div>
                        </div>

                        {/* Satellite 3: Testimonial Bubble (Right) */}
                        <div className="absolute bottom-[35%] right-[0] z-20 animate-[float_9s_ease-in-out_infinite_0.5s]">
                             <div className="px-4 py-3 bg-[#1e293b]/90 backdrop-blur-md rounded-2xl rounded-tr-none border border-white/10 shadow-xl max-w-[220px]">
                                <div className="flex items-center gap-1 mb-2 text-yellow-400">
                                    {[1,2,3,4,5].map(i => (
                                        <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    ))}
                                </div>
                                <p className="text-gray-200 text-xs leading-relaxed italic">"Dr. George's guidance completely changed my perspective on health."</p>
                             </div>
                        </div>

                        {/* Satellite 4: Experience Badge (Top Left) */}
                        <div className="absolute top-[25%] left-[20%] z-20 animate-[float_6s_ease-in-out_infinite_2s]">
                             <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 border-4 border-[#0f172a]">
                                <div className="text-center leading-none">
                                    <span className="block text-white font-bold text-lg">15+</span>
                                    <span className="block text-[8px] text-blue-200 uppercase tracking-widest">Years</span>
                                </div>
                             </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
