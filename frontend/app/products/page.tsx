"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import productsData from "@/data/products.json";

// Note: Metadata export not possible in client components
// SEO handled through layout.tsx or consider server component wrapper

export default function ProductsPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "eBook", "Guide", "Course"];

    const products = productsData;

    const filteredProducts = activeFilter === "All"
        ? products
        : products.filter(product => product.category === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm font-medium">Digital Products</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Health Education{" "}
                            <span className="text-[#0066ff]">Resources</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Evidence-based eBooks, guides, and courses designed to empower your health decisions. Instant digital download after purchase.
                        </p>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`h-11 px-6 rounded-full font-medium transition-all duration-200 ${activeFilter === filter
                                        ? "bg-[#0066ff] text-white shadow-lg"
                                        : "border-2 border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <div key={index} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#0066ff] hover:shadow-xl transition-all duration-300 group">
                                {/* Product Image/Icon Area */}
                                <div className="relative h-48 bg-gradient-to-br from-[#E0F2FE] to-[#f0f9ff] flex items-center justify-center">
                                    {/* Bestseller Badge */}
                                    {index < 2 && (
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-[#00bfa6] rounded-full text-white text-xs font-bold">
                                            Bestseller
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-[#0066ff]">
                                        {product.category === "eBooks" && (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {product.category === "Guides" && (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {product.category === "Courses" && (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Product Content */}
                                <div className="p-6">
                                    {/* Category */}
                                    <div className="text-xs font-semibold text-[#0066ff] uppercase mb-2">
                                        {product.category}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {product.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-4">
                                        {product.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M20 6L9 17l-5-5" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#0066ff">
                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-600">(92 reviews)</span>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-bold text-gray-900">{product.price}</div>
                                    <Link href="/products">
                                        <button className="h-10 px-6 rounded-full bg-[#0066ff] text-white text-sm font-medium hover:bg-[#0052cc] transition-all duration-200 cursor-pointer">
                                            View Details
                                        </button>
                                    </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No results message */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Secure & Instant Delivery */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8 border border-gray-200">
                        {/* Heading */}
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                            Secure & Instant Delivery
                        </h3>
                        <p className="text-center text-gray-600 text-sm mb-8">
                            All purchases are protected with enterprise-grade security. Download your products instantly after payment.
                        </p>

                        {/* Payment Methods */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                            {[
                                {
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    ),
                                    label: "Stripe"
                                },
                                {
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <circle cx="9" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
                                            <circle cx="15" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    ),
                                    label: "Paystack"
                                },
                                {
                                    icon: (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" />
                                            <path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ),
                                    label: "Flutterwave"
                                }
                            ].map((method, index) => (
                                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                                    <div className="text-[#0066ff]">
                                        {method.icon}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{method.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Security Features */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
                            {[
                                {
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    ),
                                    label: "Instant Download"
                                },
                                {
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    ),
                                    label: "Lifetime Access"
                                },
                                {
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" />
                                            <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    ),
                                    label: "30-day Money-back"
                                }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="text-[#00bfa6]">
                                        {feature.icon}
                                    </div>
                                    <span>{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Instant Download",
                                description: "Get immediate access to your purchase. Download and start learning right away."
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                ),
                                title: "Evidence-Based",
                                description: "All content is backed by scientific research and clinical experience."
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Lifetime Access",
                                description: "Your purchase includes lifetime access and all future updates for free."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-2xl flex items-center justify-center text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Can't Find What You Need?
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Contact us for custom educational materials or personalized consultation services.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/products">
                            <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200 cursor-pointer">
                                View All Products
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                Contact for Bulk Orders
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
