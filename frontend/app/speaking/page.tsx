"use client";

import Link from "next/link";
import Image from "next/image";

export default function SpeakingPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="pt-12 lg:pt-16 pb-20 lg:pb-24 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Inspire Your{" "}
                                <span className="text-[#0066ff]">Audience</span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                Dr. George delivers compelling presentations on drug safety, health education, and disease prevention. Available for keynotes, workshops, and consulting engagements.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link href="/booking">
                                    <button className="h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] transition-all duration-200 flex items-center gap-2 cursor-pointer">
                                        Book a Speaking Engagement
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </Link>
                                <Link href="/speaking#topics">
                                    <button className="h-12 px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer">
                                        View Topics
                                    </button>
                                </Link>
                            </div>

                            {/* Category Tags */}
                            <div className="flex flex-wrap gap-3">
                                {[
                                    "Corporate keynotes",
                                    "Healthcare conferences",
                                    "University lectures",
                                    "Community workshops",
                                    "Media appearances",
                                    "Podcast interviews"
                                ].map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                        {tag}
                                    </span>
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
                                <div className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                        <circle cx="4" cy="4" r="2"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Speaking Topics Section */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Speaking <span className="text-[#0066ff]">Topics</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Engaging, evidence-based presentations tailored to your audience's needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Past <span className="text-[#0066ff]">Engagements</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Trusted by leading organizations and institutions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                event: "Annual Healthcare Summit",
                                organization: "National Health Association",
                                date: "December 2024",
                                location: "New York, NY",
                                topic: "Medication Safety in Modern Healthcare"
                            },
                            {
                                event: "Pharmacy Leadership Conference",
                                organization: "State Pharmacists Association",
                                date: "November 2024",
                                location: "Chicago, IL",
                                topic: "Innovation in Patient Care"
                            },
                            {
                                event: "Community Health Workshop",
                                organization: "City Health Department",
                                date: "October 2024",
                                location: "Los Angeles, CA",
                                topic: "Chronic Disease Prevention"
                            },
                            {
                                event: "University Health Sciences Seminar",
                                organization: "State University",
                                date: "September 2024",
                                location: "Austin, TX",
                                topic: "Pharmacy Practice Evolution"
                            },
                            {
                                event: "Corporate Wellness Program",
                                organization: "Fortune 500 Company",
                                date: "August 2024",
                                location: "San Francisco, CA",
                                topic: "Employee Health & Medication Management"
                            },
                            {
                                event: "Teen Health Education Summit",
                                organization: "Youth Services Coalition",
                                date: "July 2024",
                                location: "Seattle, WA",
                                topic: "Preventing Prescription Drug Abuse"
                            }
                        ].map((engagement, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#0066ff] transition-all duration-300">
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
                                        <h3 className="font-bold text-gray-900 mb-1">{engagement.event}</h3>
                                        <p className="text-sm text-[#0066ff] font-medium">{engagement.organization}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3 italic">"{engagement.topic}"</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {engagement.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {engagement.location}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            What <span className="text-[#0066ff]">Organizers Say</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Feedback from event organizers and attendees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
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
            <section className="py-24 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Book Dr. George?
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Transform your next event with engaging, evidence-based health presentations. Check availability and customize your speaking engagement today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/booking">
                            <button className="h-14 px-10 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200 text-lg cursor-pointer">
                                Check Availability
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-14 px-10 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 text-lg cursor-pointer">
                                Download Speaker Kit
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
