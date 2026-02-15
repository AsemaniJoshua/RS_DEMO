"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { courseService, Course } from "@/services/course-service";

// Static services data (moved outside component or kept inside)
const staticServices = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        title: "Virtual Medication Review",
        price: "$75",
        duration: "30 min",
        description: "Comprehensive review of all current medications, identifying interactions, optimizing therapy, and addressing any medication concerns.",
        features: [
            "Complete medication list review",
            "Drug interaction analysis",
            "Side effect evaluation",
            "Written action plan"
        ],
        link: "/booking"
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Diabetes & Weight Loss Consultation",
        price: "$145",
        duration: "60 min",
        description: "Personalized program focusing on diabetes management and sustainable weight loss through medication optimization and lifestyle coaching.",
        features: [
            "Blood sugar monitoring plan",
            "Medication optimization",
            "Nutrition guidance",
            "Follow-up action items"
        ],
        link: "/booking"
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
        ),
        title: "Supplement Consultation",
        price: "$75",
        duration: "30 min",
        description: "Expert guidance on dietary supplements, assessing safety and efficacy, identifying potential drug-supplement interactions.",
        features: [
            "Supplement safety review",
            "Drug-supplement interactions",
            "Evidence-based recommendations",
            "Custom supplement plan"
        ],
        link: "/booking"
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: "Chronic Disease Management",
        price: "$145",
        duration: "60 min",
        description: "Ongoing support for managing chronic conditions through medication optimization, lifestyle modifications, and personalized care strategies.",
        features: [
            "Disease state assessment",
            "Treatment optimization",
            "Lifestyle modifications",
            "Long-term care strategy"
        ],
        link: "/booking"
    }
];

export default function ServicesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch published courses
                const response = await courseService.getAllCourses('PUBLISHED');
                if (response && Array.isArray(response)) {
                    setCourses(response.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
        };
        fetchCourses();
    }, []);

    // Helper to check if item is a course (has id) or static service
    const isCourse = (item: any): item is Course => {
        return 'categoryId' in item || 'thumbnailUrl' in item;
    };

interface ServiceItem {
    icon?: React.ReactNode;
    thumbnailUrl?: string;
    title: string;
    price: string;
    duration: string;
    description: string;
    features: string[];
    link?: string;
    id?: string;
    isCourse?: boolean;
}

    const combinedItems: ServiceItem[] = [
        // ...staticServices, // Removed static services as requested ("remove old day")
        ...courses.map(course => ({
            id: course.id,
            thumbnailUrl: course.thumbnailUrl,
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ), 
            title: course.title,
            price: `GHS ${course.price}`,
            duration: course.duration || "Self-paced",
            description: course.description,
            features: [
               "Lifetime Access",
               "Expert-led instruction",
               course.category?.name || "Educational Course"
            ],
            link: `/courses/${course.id}`, 
            isCourse: true
        }))
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-sm font-medium">Telepharmacy Services</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
                            Virtual Health{" "}
                            <span className="text-[#0066ff]">Consultations</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
                            Professional pharmacy consultations from the comfort of your home. Get expert guidance on medications, supplements, and chronic disease management.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href="/booking">
                                <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-lg transition-all duration-200 cursor-pointer">
                                    Book Consultation
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </Link>
                            <Link href="#offerings">
                                <button className="h-12 px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer">
                                    View Offerings
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service & Education Offerings (Merged Section) */}
            <section id="offerings" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Services & <span className="text-[#0066ff]">Educational Programs</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive care packages and expert-led courses designed to meet your specific health needs and learning goals.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {combinedItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#0066ff] hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                {/* Image or Icon */}
                                {item.thumbnailUrl ? (
                                    <div className="relative h-48 w-full mb-6 rounded-xl overflow-hidden">
                                        <Image 
                                            src={item.thumbnailUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : null}

                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        {!item.thumbnailUrl && (
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shrink-0">
                                                {item.icon}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                            <p className="text-sm text-gray-600">{item.duration}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xl sm:text-2xl font-bold text-[#0066ff] whitespace-nowrap">{item.price}</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                                    {item.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {item.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                                                <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
                                                <path d="M9 12l2 2 4-4" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="line-clamp-1">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                {'isCourse' in item ? (
                                    <button 
                                        onClick={() => router.push(`/services/${item.id}`)}
                                        className="w-full h-12 rounded-full bg-white border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        View Course Details
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <Link href={item.link || '#'}>
                                        <button className="w-full h-12 rounded-full bg-[#0066ff] text-white hover:bg-[#0052cc] font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
                                            Book This Service
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            How it Works
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Simple, convenient, and designed to fit easily into your lifestyle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                step: "1",
                                title: "Book Your Session",
                                description: "Choose your preferred date and time online (or select a course)"
                            },
                            {
                                step: "2",
                                title: "Complete Health Form",
                                description: "Fill out a brief health questionnaire (for consultations)"
                            },
                            {
                                step: "3",
                                title: "Virtual Consultation",
                                description: "Meet via secure video for your session or start learning"
                            },
                            {
                                step: "4",
                                title: "Receive Your Plan",
                                description: "Get personalized recommendations and action steps"
                            }
                        ].map((step, index) => (
                            <div key={index} className="text-center group">
                                {/* Number Circle */}
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-[#0066ff] flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {step.step}
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gray-300">
                                            <div className="h-full bg-[#0066ff] w-0 group-hover:w-full transition-all duration-500"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Book Your Consultation */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Book Your Consultation
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600">
                                Select a date that works for you. We offer flexible scheduling to accommodate your needs.
                            </p>
                        </div>

                        {/* Scheduling Widget Card */}
                        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-200 text-center">
                            {/* Calendar Icon - Dynamic Current Date */}
                            <div className="w-full max-w-[320px] mx-auto mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                {/* Calendar Header */}
                                <div className="bg-[#0066ff] px-4 py-3 text-white flex items-center justify-between">
                                    <span className="font-bold text-sm">
                                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white font-medium">Today</span>
                                </div>
                                {/* Calendar Grid */}
                                <div className="p-4">
                                    <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-400">
                                        {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-sm">
                                        {(() => {
                                            const today = new Date();
                                            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
                                            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
                                            const days = [];
                                            
                                            // Empty slots for previous month
                                            for(let i=0; i<firstDay; i++) {
                                                days.push(<div key={`empty-${i}`} className="h-8"></div>);
                                            }
                                            
                                            // Days
                                            for(let i=1; i<=daysInMonth; i++) {
                                                const isToday = i === today.getDate();
                                                days.push(
                                                    <div key={i} className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-xs transition-colors ${
                                                        isToday 
                                                            ? 'bg-[#0066ff] text-white font-bold shadow-md' 
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}>
                                                        {i}
                                                    </div>
                                                );
                                            }
                                            return days;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            {/* <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Calendly Integration
                            </h3> */}

                            {/* Description */}
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Schedule your consultation with our integrated booking system. Choose a time that works best for you.
                            </p>

                            {/* CTA Button */}
                            <Link href="/booking">
                                <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-lg transition-all duration-200 cursor-pointer">
                                    Book Now
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </Link>

                            {/* Info Items */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Same-week availability</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>45-60 min sessions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>24-hour cancellation policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Book your consultation today and take the first step toward optimized health and wellness.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/booking">
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200 cursor-pointer">
                                Book Your Consultation
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
