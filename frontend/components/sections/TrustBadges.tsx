"use client";

import { useEffect, useState } from "react";
import { publicService, CredentialCertification, AchievementAward } from "@/services/public-service";

interface Badge {
    name: string;
    fullName: string;
    description: string;
}

export default function TrustBadges() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await publicService.getPersonalBrand();
                if (response.data) {
                    const credentials = response.data.credentialCertifications || [];
                    const achievements = response.data.achievementAwards || [];

                    // Map credentials to badge format
                    const credentialBadges = credentials.map((cred) => ({
                        name: getAcronym(cred.institution),
                        fullName: cred.institution,
                        description: cred.title
                    }));

                    // Map achievements to badge format
                    const achievementBadges = achievements.map((ach) => ({
                        name: getAcronym(ach.issuer),
                        fullName: ach.issuer,
                        description: ach.title
                    }));

                    // Combine and take first 4 (or more)
                    setBadges([...credentialBadges, ...achievementBadges]);
                }
            } catch (error) {
                console.error("Failed to fetch trust badges", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getAcronym = (str: string) => {
        if (!str) return "CERT";
        const matches = str.match(/\b(\w)/g);
        return matches ? matches.join('').substring(0, 4).toUpperCase() : str.substring(0, 4).toUpperCase();
    };

    if (loading) {
        return (
            <section className="py-10 sm:py-12 lg:py-16 bg-white border-b border-gray-100">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-[#0066ff] border-t-transparent rounded-full"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 sm:py-12 lg:py-16 bg-white border-b border-gray-100">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                {badges.length > 0 && (
                    <>
                        <div className="text-center mb-12">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Trusted & Certified</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Professional Affiliations & Certifications</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            {badges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#0066ff] hover:shadow-lg transition-all duration-300 group"
                                >
                                    {/* Badge Circle */}
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-xl font-bold text-white">{badge.name}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center">
                                        <h4 className="text-sm font-bold text-gray-900 mb-1">{badge.fullName}</h4>
                                        <p className="text-xs text-gray-600">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Additional Trust Element */}
                <div className="text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">Verified Credentials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">15+ Years Experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">10,000+ Patients Served</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
