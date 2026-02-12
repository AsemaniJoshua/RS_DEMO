"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { publicService, PublicSpeaking, PublicPersonalBrand } from "@/services/public-service";
import { useAuth } from "@/contexts/auth-context";

export default function SpeakingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [events, setEvents] = useState<PublicSpeaking[]>([]);
    const [completedEvents, setCompletedEvents] = useState<PublicSpeaking[]>([]);
    const [categories, setCategories] = useState<string[]>(["All Categories"]);
    const [personalBrand, setPersonalBrand] = useState<PublicPersonalBrand | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingCompleted, setLoadingCompleted] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("All Categories");

    // Fetch upcoming events based on active category
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await publicService.getSpeakingEvents(
                    activeCategory === "All Categories" ? undefined : activeCategory,
                    undefined,
                    "UPCOMING"
                );
                if (response.success && response.data?.events) {
                    setEvents(response.data.events);
                }
            } catch (error) {
                console.error("Failed to fetch upcoming speaking events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [activeCategory]);

    // Fetch completed events for Past Engagements section
    useEffect(() => {
        const fetchCompletedEvents = async () => {
            setLoadingCompleted(true);
            try {
                const response = await publicService.getSpeakingEvents(
                    undefined,
                    undefined,
                    "COMPLETED"
                );
                if (response.success && response.data?.events) {
                    setCompletedEvents(response.data.events);
                }
            } catch (error) {
                console.error("Failed to fetch completed speaking events:", error);
            } finally {
                setLoadingCompleted(false);
            }
        };

        fetchCompletedEvents();
    }, []);

    // Fetch categories and personal brand on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoriesResponse, brandResponse] = await Promise.all([
                    publicService.getSpeakingCategories(),
                    publicService.getPersonalBrand()
                ]);
                
                if (categoriesResponse.success && categoriesResponse.data?.categories) {
                    const categoryNames = categoriesResponse.data.categories.map(cat => cat.name);
                    setCategories(["All Categories", ...categoryNames]);
                }
                
                if (brandResponse.data) {
                    setPersonalBrand(brandResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories or personal brand:", error);
            }
        };

        fetchInitialData();
    }, []);

    const handleEventClick = (eventId: string) => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/dashboard/speaking/${eventId}`);
        } else {
            router.push(`/dashboard/speaking/${eventId}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <span className="text-sm font-medium">Speaking & Consulting</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
                                Inspire Your{" "}
                                <span className="text-[#0066ff]">Audience</span>
                            </h1>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
                                Dr. George delivers compelling presentations on drug safety, health education, and disease prevention. Available for keynotes, workshops, and consulting engagements.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link href="/booking">
                                    <button className="h-12 px-6 sm:px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm sm:text-base whitespace-nowrap">
                                        Book a Speaking Engagement
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </Link>
                                <Link href="/speaking#topics">
                                    <button className="h-12 px-6 sm:px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer text-sm sm:text-base">
                                        View Topics
                                    </button>
                                </Link>
                            </div>

                            {/* Category Tags */}
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-3 py-1 text-sm rounded-full transition-all duration-200 cursor-pointer ${
                                            activeCategory === category
                                                ? "bg-[#0066ff] text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                                <Image
                                    src="/dr-george.png"
                                    alt="Dr. George - Professional Pharmacist"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/* LinkedIn badge */}
                                {personalBrand?.socialMedia?.linkedin && (
                                    <a
                                        href={personalBrand.socialMedia.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                                            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Upcoming <span className="text-[#0066ff]">Events</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            {activeCategory === "All Categories" 
                                ? "View all scheduled speaking engagements and events."
                                : `Filtered by: ${activeCategory}`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-gray-400">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <p className="text-gray-600 text-lg">No upcoming events found for this category.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div 
                                    key={event.id} 
                                    onClick={() => handleEventClick(event.id)}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#0066ff] transition-all duration-300 cursor-pointer"
                                >
                                    {event.image && (
                                        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#0066ff] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                                            <p className="text-sm text-[#0066ff] font-medium">{event.venue}</p>
                                        </div>
                                    </div>
                                    {event.description && (
                                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            {formatDate(event.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            {event.location}
                                        </span>
                                    </div>
                                    {event.category && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <span className="text-xs text-gray-600 font-medium">Category: {event.category}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Speaking Topics Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Speaking <span className="text-[#0066ff]">Topics</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Engaging, evidence-based presentations tailored to your audience's needs.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ),
                                title: "Medication Safety & Management",
                                description: "Essential strategies for preventing medication errors and optimizing therapy outcomes.",
                                points: ["Drug interactions", "Polypharmacy management", "Patient safety protocols"]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                ),
                                title: "Chronic Disease Prevention",
                                description: "Proactive approaches to preventing and managing chronic conditions through lifestyle and medication.",
                                points: ["Diabetes prevention", "Heart health strategies", "Evidence-based interventions"]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                ),
                                title: "Teen Drug Abuse Prevention",
                                description: "Critical insights for parents, educators, and communities on preventing prescription drug misuse.",
                                points: ["Warning signs", "Prevention strategies", "Community education"]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ),
                                title: "Health Literacy & Patient Education",
                                description: "Empowering patients and caregivers with knowledge to make informed health decisions.",
                                points: ["Communication strategies", "Health literacy best practices", "Patient engagement"]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M12 1v6m0 6v6M1 12h6m6 0h6" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                ),
                                title: "Pharmacy Practice Innovation",
                                description: "Modern approaches to pharmacy services and patient care optimization.",
                                points: ["Clinical pharmacy services", "Technology integration", "Workflow optimization"]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2"/>
                                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                ),
                                title: "Supplement Safety",
                                description: "Navigating the complex world of dietary supplements with evidence-based guidance.",
                                points: ["Quality assessment", "Drug-supplement interactions", "Regulation and safety"]
                            }
                        ].map((topic, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#0066ff] hover:shadow-lg transition-all duration-300 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {topic.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{topic.title}</h3>
                                <p className="text-gray-600 mb-4">{topic.description}</p>
                                <ul className="space-y-2">
                                    {topic.points.map((point, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Past Engagements Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Past <span className="text-[#0066ff]">Engagements</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Trusted by leading organizations and institutions.
                        </p>
                    </div>

                    {loadingCompleted ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]"></div>
                        </div>
                    ) : completedEvents.length === 0 ? (
                        <div className="text-center py-20">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-gray-400">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <p className="text-gray-600 text-lg">No past engagements available.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedEvents.map((event) => (
                                <div 
                                    key={event.id} 
                                    onClick={() => handleEventClick(event.id)}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#0066ff] transition-all duration-300 cursor-pointer"
                                >
                                    {event.image && (
                                        <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-10 h-10 bg-[#0066ff] rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                                            <p className="text-sm text-[#0066ff] font-medium">{event.venue}</p>
                                        </div>
                                    </div>
                                    {event.description && (
                                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{event.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            {formatDate(event.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            {event.location}
                                        </span>
                                    </div>
                                    {event.category && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <span className="text-xs text-gray-600 font-medium">Category: {event.category}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            What <span className="text-[#0066ff]">Organizers Say</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Feedback from event organizers and attendees.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Dr. George's presentation was engaging, informative, and perfectly tailored to our audience. Our team gained valuable insights on medication safety.",
                                name: "Sarah Johnson",
                                title: "Conference Director",
                                organization: "National Health Association",
                                rating: 5
                            },
                            {
                                quote: "Outstanding speaker! The content was evidence-based and delivered with clarity. Attendees are still talking about the practical strategies shared.",
                                name: "Michael Chen",
                                title: "Education Coordinator",
                                organization: "State Pharmacists Association",
                                rating: 5
                            },
                            {
                                quote: "Dr. George made complex health topics accessible and actionable. The workshop exceeded our expectations and received rave reviews.",
                                name: "Emily Rodriguez",
                                title: "Community Health Manager",
                                organization: "City Health Department",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#0066ff">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center text-white font-bold">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.title}</p>
                                        <p className="text-xs text-[#0066ff]">{testimonial.organization}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking CTA Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Book Dr. George?
                    </h2>
                    <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Transform your next event with engaging, evidence-based health presentations. Check availability and customize your speaking engagement today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/booking">
                            <button className="h-14 px-8 sm:px-10 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200 text-base sm:text-lg cursor-pointer">
                                Check Availability
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-14 px-6 sm:px-10 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 text-sm sm:text-lg cursor-pointer whitespace-nowrap">
                                Download Speaker Kit
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
