"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { publicService, PublicEbook, PublicCourse } from "@/services/public-service";
import Image from "next/image";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const productType = searchParams.get('type') as 'eBook' | 'Course' | null;
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState<(PublicEbook & { type: 'eBook' }) | (PublicCourse & { type: 'Course' }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                if (productType === 'eBook') {
                    const response = await publicService.getPublicEbookById(id);
                    // Backend returns { status: 'success', data: { ebook } }
                    const ebookData = (response.data as any)?.ebook || response.data;
                    if (ebookData) {
                        setProduct({ ...ebookData, type: 'eBook' as const });
                    } else {
                        setError("eBook not found");
                    }
                } else if (productType === 'Course') {
                    const response = await publicService.getPublicCourseById(id);
                    if (response.data) {
                        setProduct({ ...response.data, type: 'Course' as const });
                    } else {
                        setError("Course not found");
                    }
                } else {
                    setError("Invalid product type");
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        if (id && productType) {
            fetchProduct();
        }
    }, [id, productType]);

    const handlePurchaseEnroll = () => {
        if (!product) return;

        const redirectPath = product.type === 'eBook' 
            ? `/dashboard/ebooks/${product.id}`
            : `/dashboard/browse-courses/${product.id}`;

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
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-12 text-center max-w-md border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "This product doesn't exist."}</p>
                    <Link href="/products">
                        <button className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors">
                            Back to Products
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 py-6">
                    <Link 
                        href="/products" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0066ff] transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Back to Products</span>
                    </Link>
                </div>
            </div>

            {/* Product Details */}
            <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Image/Icon */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 sticky top-6">
                            <div className="aspect-square relative bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] rounded-xl flex items-center justify-center mb-6">
                                {product.type === 'eBook' && (product as PublicEbook & { type: 'eBook' }).coverImage ? (
                                    <Image 
                                        src={(product as PublicEbook & { type: 'eBook' }).coverImage}
                                        alt={product.title}
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                ) : product.type === 'Course' && (product as PublicCourse & { type: 'Course' }).thumbnailUrl ? (
                                    <Image 
                                        src={(product as PublicCourse & { type: 'Course' }).thumbnailUrl || ''}
                                        alt={product.title}
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0066ff]">
                                        {product.type === "Course" ? (
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Price & Action */}
                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Price</p>
                                        <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        {product.type}
                                    </span>
                                </div>

                                <button
                                    onClick={handlePurchaseEnroll}
                                    className="w-full px-6 py-4 bg-[#0066ff] text-white rounded-xl hover:bg-[#0052cc] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                                >
                                    {product.type === 'eBook' ? 'Get This eBook' : 'Enroll in Course'}
                                </button>

                                {!isAuthenticated && (
                                    <p className="text-sm text-gray-600 text-center">
                                        You'll be asked to log in to proceed with your purchase
                                    </p>
                                )}
                            </div>

                            {/* Features */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                                <ul className="space-y-2">
                                    {product.type === 'eBook' ? (
                                        <>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {(product as PublicEbook & { type: 'eBook' }).pages} pages
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Instant download
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                PDF format
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Lifetime access
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            {(product as PublicCourse & { type: 'Course' }).duration && (
                                                <li className="flex items-center gap-2 text-sm text-gray-700">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Duration: {(product as PublicCourse & { type: 'Course' }).duration}
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
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    {product.category && (
                                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                            {typeof product.category === 'object' ? product.category.name : product.category}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                        Published
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
                                {product.type === 'eBook' && (
                                    <p className="text-lg text-gray-600">By {(product as PublicEbook & { type: 'eBook' }).author}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description}
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
                                    <p className="text-sm text-gray-600">Access your purchase immediately after payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
