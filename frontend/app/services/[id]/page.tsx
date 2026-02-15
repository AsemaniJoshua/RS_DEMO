"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { publicService, PublicCourse } from "@/services/public-service";

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
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
                    <p className="text-gray-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
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
                        <button className="h-12 px-6 rounded-full bg-[#0066ff] text-white hover:bg-[#0052cc] transition-all">
                            Back to Services
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <section className="py-6 bg-white border-b border-gray-200">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-[#0066ff]">Home</Link>
                        <span>/</span>
                        <Link href="/services" className="hover:text-[#0066ff]">Services</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{service.title}</span>
                    </div>
                </div>
            </section>

            {/* Service Details */}
            <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Image/Icon */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-6">
                            <div className="aspect-square relative bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] rounded-xl flex items-center justify-center mb-6">
                                {service.thumbnailUrl ? (
                                    <Image 
                                        src={service.thumbnailUrl}
                                        alt={service.title}
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0066ff]">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Price & Action */}
                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Course Price</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatPrice(service.price)}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleEnroll}
                                    className="w-full h-14 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                {/* What's Included */}
                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-4">What's Included</h4>
                                    <ul className="space-y-2">
                                        {service.duration && (
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Duration: {service.duration}
                                            </li>
                                        )}
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Downloadable resources
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Lifetime access
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Certificate of completion
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    {service.category && (
                                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                            {typeof service.category === 'object' ? service.category.name : service.category}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                        Published
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {service.description}
                                </p>
                            </div>

                            {/* Additional Info */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
                                    <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
                                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
                                    <p className="text-sm text-gray-600">Start learning immediately after enrollment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
