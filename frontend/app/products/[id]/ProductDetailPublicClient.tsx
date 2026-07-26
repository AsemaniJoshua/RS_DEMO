"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDynamicParam } from "@/hooks/useDynamicParam";
import { useAuth } from "@/contexts/auth-context";
import { publicService, PublicEbook, PublicCourse } from "@/services/public-service";
import Image from "next/image";

export default function ProductDetailPublicClient() {
    const id = useDynamicParam("id");
    const router = useRouter();
    const searchParams = useSearchParams();
    const productType = searchParams?.get('type') as 'eBook' | 'Course' | null;
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
                    <p className="text-gray-600 font-medium">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md border border-gray-100 shadow-xl">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "This product doesn't exist."}</p>
                    <Link href="/products">
                        <button className="px-6 py-3 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors font-semibold cursor-pointer">
                            Back to Products
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
                        <Link href="/products" className="hover:text-[#0066ff] transition-colors">Products</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12 lg:py-16">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        {/* LEFT COLUMN: Product Info & Description (Col-span 7) */}
                        <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
                            {/* Product Header */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/10">
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    {product.category && (
                                        <span className="px-3.5 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {typeof product.category === 'object' ? product.category.name : product.category}
                                        </span>
                                    )}
                                    <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {product.type}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-3 break-words [word-break:break-word]">
                                    {product.title}
                                </h1>
                                {product.type === 'eBook' && (
                                    <p className="text-sm sm:text-base text-gray-500 font-medium">By {(product as PublicEbook & { type: 'eBook' }).author}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-100/10">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-50">Description</h2>
                                {product.description ? (
                                    <div 
                                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed [word-break:break-word] overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                ) : (
                                    <p className="text-gray-500 italic">No description provided for this product.</p>
                                )}
                            </div>

                            {/* Trust Features */}
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
                                        <p className="text-xs sm:text-sm text-gray-500">Access your purchase immediately after payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Product Media & Action Card (Col-span 5) */}
                        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-6">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-100/25 space-y-6">
                                {/* Thumbnail Image */}
                                <div className="aspect-video sm:aspect-square lg:aspect-video relative bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner">
                                    {product.type === 'eBook' && (product as PublicEbook & { type: 'eBook' }).coverImage ? (
                                        <Image 
                                            src={(product as PublicEbook & { type: 'eBook' }).coverImage}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : product.type === 'Course' && (product as PublicCourse & { type: 'Course' }).thumbnailUrl ? (
                                        <Image 
                                            src={(product as PublicCourse & { type: 'Course' }).thumbnailUrl || ''}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0066ff]">
                                            {product.type === "Course" ? (
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                                </svg>
                                            ) : (
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                                                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Price / Type Badge */}
                                <div className="flex items-end justify-between pt-2">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                        <p className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">{formatPrice(product.price)}</p>
                                    </div>
                                    <span className="px-3.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                                        {product.type}
                                    </span>
                                </div>

                                {/* Purchase / Enroll Button */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handlePurchaseEnroll}
                                        className="w-full h-14 rounded-full bg-[#0066ff] text-white font-bold hover:bg-[#0052cc] hover:shadow-lg hover:shadow-[#0066ff]/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        {product.type === 'eBook' ? 'Get This eBook' : 'Enroll in Course'}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </button>

                                    {!isAuthenticated && (
                                        <p className="text-xs text-gray-500 text-center font-medium">
                                            You'll be asked to log in to proceed with your purchase
                                        </p>
                                    )}
                                </div>

                                {/* What's Included list */}
                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4">What's Included</h4>
                                    <ul className="space-y-3">
                                        {product.type === 'eBook' ? (
                                            <>
                                                <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 5 12" />
                                                        </svg>
                                                    </div>
                                                    <span>{(product as PublicEbook & { type: 'eBook' }).pages || 100} pages</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 5 12" />
                                                        </svg>
                                                    </div>
                                                    <span>Instant download</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 5 12" />
                                                        </svg>
                                                    </div>
                                                    <span>PDF format</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                                    <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 5 12" />
                                                        </svg>
                                                    </div>
                                                    <span>Lifetime access</span>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                {(product as PublicCourse & { type: 'Course' }).duration && (
                                                    <li className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                                                        <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0066ff] flex items-center justify-center shrink-0">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 5 12" />
                                                            </svg>
                                                        </div>
                                                        <span>Duration: {(product as PublicCourse & { type: 'Course' }).duration}</span>
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
                                            </>
                                        )}
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
