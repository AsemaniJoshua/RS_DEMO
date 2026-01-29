"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { publicService, PublicPersonalBrand, AreaOfExpertise, CredentialCertification, AchievementAward } from "@/services/public-service";

const UserCheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 11 19 13 23 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Helper for random gradient
const getRandomGradient = (index: number) => {
    const gradients = [
        "from-[#0066ff] to-[#0052cc]",
        "from-[#0066ff] to-[#00acac]",
        "from-[#00acac] to-[#00bfa6]",
        "from-[#00bfa6] to-[#2dd4bf]"
    ];
    return gradients[index % gradients.length];
};

const getAcronym = (str: string) => {
    if (!str) return "AWD";
    const matches = str.match(/\b(\w)/g);
    return matches ? matches.join('').substring(0, 4).toUpperCase() : str.substring(0, 4).toUpperCase();
};

export default function AboutPage() {
    const [personalBrand, setPersonalBrand] = useState<PublicPersonalBrand | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await publicService.getPersonalBrand();
                if (response.data) {
                    setPersonalBrand(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch personal brand", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const expertise: AreaOfExpertise[] = personalBrand?.areasOfExpertise || [];
    const credentials: CredentialCertification[] = personalBrand?.credentialCertifications || [];
    const achievements: AchievementAward[] = personalBrand?.achievementAwards || [];

    // Map achievements to Affiliations format
    const affiliations = achievements.map((ach, index) => ({
        org: ach.issuer,
        role: ach.title,
        badge: getAcronym(ach.issuer),
        gradient: getRandomGradient(index),
        description: `Awarded on ${new Date(ach.issueDate).toLocaleDateString()}`
    }));

    // Map credentials to Journey format(sorted by date)
    const journey = [...credentials].sort((a,b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()).map(cred => ({
        year: new Date(cred.issueDate).getFullYear().toString(),
        title: cred.title,
        description: cred.institution
    }));


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                                <UserCheckIcon />
                                <span className="text-sm font-medium">Healthcare Professional</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
                                Meet{" "}
                                <span className="text-[#0066ff]">{personalBrand?.profile?.fullName || "Dr. George"}</span>
                            </h1>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
                                {personalBrand?.profile?.full_bio || "A passionate pharmacist and health educator dedicated to empowering individuals with the knowledge they need to make informed health decisions."}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link href="/booking">
                                    <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-lg transition-all duration-200 cursor-pointer">
                                        Book Consultation
                                        <ArrowRightIcon />
                                    </button>
                                </Link>
                                <Link href="/speaking">
                                    <button className="h-12 px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer">
                                        Speaking Inquiries
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src={personalBrand?.profile?.profile_image_url || "/dr-george.png"}
                                    alt="Dr. George - Healthcare Professional"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Areas of Expertise
                        </h2>
                        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
                            Specialized knowledge and experience across multiple healthcare domains
                        </p>
                    </div>

                    {expertise.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {expertise.map((item, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {/* Generic Icon or based on index */}
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{item.name}</h3>
                                    <p className="text-white/80 leading-relaxed">Expert guidance in {item.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 border-dashed">
                             <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-white">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 15.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">No Expertise Added Yet</h3>
                            <p className="text-white/80 text-sm">Areas of expertise will be listed here.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Professional Journey */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Professional Journey
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Key milestones shaping a career dedicated to health excellence.
                        </p>
                    </div>

                    {journey.length > 0 ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gray-200"></div>

                                <div className="space-y-8">
                                    {journey.map((item, index) => (
                                        <div key={index} className="relative pl-12 sm:pl-16 group">
                                            {/* Timeline Dot */}
                                            <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-[#0066ff] to-[#00bfa6] border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-white text-sm font-bold">{index + 1}</span>
                                            </div>

                                            {/* Content Card */}
                                            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                                                <div className="flex items-baseline justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                                    <span className="text-sm text-[#0066ff] font-semibold">{item.year}</span>
                                                </div>
                                                <p className="text-gray-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 max-w-4xl mx-auto">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Journey Not Available</h3>
                            <p className="text-gray-500 text-sm">Professional milestones will appear here.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Professional Affiliations (Achievements) */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
                        Professional <span className="text-[#0066ff]">Affiliations & Awards</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
                        Recognitions and active memberships in leading healthcare organizations
                    </p>

                    {affiliations.length > 0 ? (
                        <div className="space-y-6">
                            {affiliations.map((item, index) => (
                                <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                                        {/* Badge */}
                                        <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-linear-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                            <span className="text-xl sm:text-2xl font-bold text-white max-w-[80%] text-center leading-tight text-xs sm:text-sm">{item.badge}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{item.org}</h3>
                                            <p className="text-gray-600 mb-3">{item.description}</p>
                                            <span className={`inline-block px-4 py-1.5 rounded-full bg-linear-to-r ${item.gradient} text-white text-sm font-medium`}>
                                                {item.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                             <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Affiliations Listed</h3>
                            <p className="text-gray-500 text-sm">Awards and affiliations will be displayed here.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Mission & Values (Static for now as requested only dynamic for others) */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Mission & Values
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Guided by a commitment to improving lives through accessible, evidence-based health education.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Patient-Centered Care",
                                description: "Every recommendation is tailored to individual needs and circumstances."
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Evidence-Based Practice",
                                description: "All guidance is grounded in the latest scientific research and clinical evidence."
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Community Impact",
                                description: "Committed to improving public health through education and accessibility."
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                                {/* Icon */}
                                <div className="w-16 h-16 bg-[#E0F2FE] rounded-2xl flex items-center justify-center text-[#0066ff] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {value.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Credentials (List) */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: Credentials */}
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Professional Credentials
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Backed by extensive education, certifications, and real-world clinical experience.
                            </p>

                            {credentials.length > 0 ? (
                                <div className="space-y-4">
                                    {credentials.map((credential, index) => (
                                        <div key={index} className="flex items-start gap-3 group">
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-[#00bfa6] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-200">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-900 font-medium">
                                                {credential.title} - <span className="text-gray-500 font-normal">{credential.institution}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-100 rounded-2xl border border-dashed border-gray-300">
                                     <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">No Credentials Listed</h3>
                                    <p className="text-gray-500 text-xs">Credentials will be shown here.</p>
                                </div>
                            )}
                        </div>

                        {/* Right: Achievement Stats (Keep static or map real stats if available? User didn't ask to change stats, but stats are usually hardcoded or aggregated. I'll leave them static for now as requested changes were specific to sections) */}
                        <div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        value: achievements.length.toString(),
                                        label: "Awards Won",
                                        gradient: "from-[#0066ff] to-[#0052cc]"
                                    },
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        value: "10,000+",
                                        label: "Patients Served",
                                        gradient: "from-[#0066ff] to-[#00acac]"
                                    },
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 1a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3 3 3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" />
                                                <path d="M19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m7-4v10m-7-3l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        value: "500+",
                                        label: "Speaking Events",
                                        gradient: "from-[#00acac] to-[#00bfa6]"
                                    },
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        ),
                                        value: expertise.length.toString(),
                                        label: "Expertise Areas",
                                        gradient: "from-[#00bfa6] to-[#2dd4bf]"
                                    }
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                                        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {stat.icon}
                                        </div>
                                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Let's Work Together CTA */}
            <section className="py-12 sm:py-16 lg:py-20 bg-[#1a1f35]">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Let's Work Together
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                            Whether you need a consultation, speaking engagement, or health education partnership, I'm here to help.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href="/booking">
                                <button className="h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-xl shadow-lg transition-all duration-200 cursor-pointer">
                                    Start Your Journey
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                    Contact Me
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
