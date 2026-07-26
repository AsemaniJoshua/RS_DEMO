"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDynamicParam } from "@/hooks/useDynamicParam";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { publicService, PublicCourse } from "@/services/public-service";

export default function ServiceDetailPublicClient() {
    const id = useDynamicParam("id");
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [service, setService] = useState<PublicCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                const response = await publicService.getPublicCourseById(id);
                if (response.data) {
                    setService(response.data);
                } else {
                    setError("Service not found");
                }
            } catch (err) {
                console.error("Failed to fetch service:", err);
                setError("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchService();
        }
    }, [id]);

    const handleEnroll = () => {
        if (!service) return;

        const redirectPath = `/dashboard/browse-courses/${service.id}`;

        if (!isAuthenticated) {
            router.push(`/login?redirect=${redirectPath}`);
        } else {
            router.push(redirectPath);
        }
    };

    const formatPrice = (price: string | number | undefined) => {
        if (price === undefined) return 'Free';
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numPrice)) return 'Free';
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS'
        }).format(numPrice);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-3xl p-8 sm:p-12 max-w-md shadow-xl border border-gray-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                            <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                            <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || "The service you're looking for doesn't exist."}</p>
                    <Link href="/services">
                        <button className="h-12 px-6 rounded-full bg-[#0066ff] text-white hover:bg-[#0052cc] transition-all cursor-pointer font-medium">
                            Back to Services
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 py-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
                        <Link href="/" className="hover:text-[#0066ff] transition-colors">Home</Link>
                        <span className="text-gray-300">/</span>
                        <Link href="/services" className="hover:text-[#0066ff] transition-colors">Services</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{service.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        {/* LEFT COLUMN: Service Info & Description (Col-span 7) */}
                        <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
                            {/* Service Header Info */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/10">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    {service.category && (
                                        <span className="px-3.5 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {typeof service.category === 'object' ? service.category.name : service.category}
                                        </span>
                                    )}
                                    <span className="px-3.5 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Published
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4 break-words [word-break:break-word]">
                                    {service.title}
                                </h1>
                            </div>

                            {/* About Course/Service */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-100/10">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">About This Course</h2>
                                {service.description ? (
                                    <div 
                                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed [word-break:break-word] overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: service.description }}
                                    />
                                ) : (
                                    <p className="text-gray-500 italic">No description provided for this service.</p>
                                )}
                            </div>

                            {/* Trust Features / Badges */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-100/5 flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066ff] shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
                                        <p className="text-xs sm:text-sm text-gray-500">Your payment information is encrypted and secure</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-100/5 flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">Instant Access</h3>
                                        <p className="text-xs sm:text-sm text-gray-500">Start learning immediately after enrollment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Interactive Sidebar Card (Col-span 5) */}
                        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/25 space-y-6">
                                {/* Course Media/Thumbnail */}
                                <div className="aspect-video sm:aspect-square lg:aspect-video relative bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                                    {service.thumbnailUrl ? (
                                        <Image 
                                            src={service.thumbnailUrl}
                                            alt={service.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0066ff]">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Price block */}
                                <div className="flex items-end justify-between pt-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Course Price</p>
                                        <p className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">{formatPrice(service.price)}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <button 
                                    onClick={handleEnroll}
                                    className="w-full h-14 rounded-full bg-[#0066ff] text-white font-bold hover:bg-[#0052cc] hover:shadow-lg hover:shadow-[#0066ff]/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>

                                {/* What's Included List */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4">What's Included</h4>
                                    <ul className="space-y-3">
                                        {service.duration && (
                                            <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                                <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 5 12" />
                                                    </svg>
                                                </div>
                                                <span>Duration: {service.duration}</span>
                                            </li>
                                        )}
                                        <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 5 12" />
                                                </svg>
                                            </div>
                                            <span>Downloadable resources</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 5 12" />
                                                </svg>
                                            </div>
                                            <span>Lifetime access</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 5 12" />
                                                </svg>
                                            </div>
                                            <span>Certificate of completion</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
