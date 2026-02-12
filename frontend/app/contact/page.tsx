"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import contactFAQsData from "@/data/contactFAQs.json";
import { publicService, PublicPersonalBrand } from "@/services/public-service";

export default function ContactPage() {
    const [personalBrand, setPersonalBrand] = useState<PublicPersonalBrand | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    // Fetch personal brand data
    useEffect(() => {
        const fetchPersonalBrand = async () => {
            try {
                const response = await publicService.getPersonalBrand();
                if (response.data) {
                    setPersonalBrand(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch personal brand:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonalBrand();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setSubmitting(true);
        try {
            const response = await publicService.submitContactForm(formData);
            
            if (response.success) {
                toast.success(response.data?.message || "Message sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                });
            }
        } catch (error: any) {
            console.error("Failed to submit contact form:", error);
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const profile = personalBrand?.profile;
    const socialMedia = personalBrand?.socialMedia;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-8 sm:py-12 lg:py-16 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-sm font-medium">Get in Touch</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
                            Contact{" "}
                            <span className="text-[#0066ff]">Dr. George</span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
                            Have questions about services, products, or consultations? I'm here to help. Reach out and I'll get back to you within 24 hours.
                        </p>

                        {/* Quick Contact Methods */}
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            {profile?.email && (
                                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-gray-700 hover:text-[#0066ff] transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="font-medium">{profile.email}</span>
                                </a>
                            )}
                            {profile?.phoneNumber && (
                                <a href={`tel:${profile.phoneNumber}`} className="flex items-center gap-2 text-gray-700 hover:text-[#0066ff] transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="font-medium">{profile.phoneNumber}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Contact Form (2/3 width) */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-6 lg:p-8 xl:p-10 border-2 border-gray-100">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send a Message</h2>
                                <p className="text-gray-600 mb-8">Fill out the form below and I'll respond as soon as possible.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Email */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors text-gray-900"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors text-gray-900"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Subject */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors text-gray-900"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                Subject *
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors text-gray-900"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="consultation">Book a Consultation</option>
                                                <option value="speaking">Speaking Engagement</option>
                                                <option value="products">Products & Resources</option>
                                                <option value="media">Media Inquiry</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors resize-none text-gray-900"
                                            placeholder="Tell me how I can help you..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? "Sending..." : "Send Message"}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Contact Info Sidebar (1/3 width) */}
                        <div className="space-y-6">
                            {/* Contact Info Cards */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center shrink-0">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Email</p>
                                            {profile?.email ? (
                                                <a href={`mailto:${profile.email}`} className="text-gray-900 hover:text-[#0066ff] transition-colors">
                                                    {profile.email}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500">Loading...</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center shrink-0">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Phone</p>
                                            {profile?.phoneNumber ? (
                                                <a href={`tel:${profile.phoneNumber}`} className="text-gray-900 hover:text-[#0066ff] transition-colors">
                                                    {profile.phoneNumber}
                                                </a>
                                            ) : (
                                                <p className="text-gray-500">Loading...</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center shrink-0">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Office</p>
                                            {profile?.location ? (
                                                <p className="text-gray-900">{profile.location}</p>
                                            ) : (
                                                <p className="text-gray-500">Loading...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Office Hours</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Monday - Friday</span>
                                        <span className="font-medium text-gray-900">9:00 AM - 5:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Saturday</span>
                                        <span className="font-medium text-gray-900">10:00 AM - 2:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sunday</span>
                                        <span className="font-medium text-gray-900">Closed</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        <strong>Note:</strong> Virtual consultations available outside regular hours
                                    </p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Me</h3>
                                <div className="flex flex-wrap gap-3">
                                    {socialMedia?.linkedin && (
                                        <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center text-[#0066ff] hover:bg-[#0066ff] hover:text-white transition-all">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                                <circle cx="4" cy="4" r="2"/>
                                            </svg>
                                        </a>
                                    )}
                                    {socialMedia?.twitter && (
                                        <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center text-[#0066ff] hover:bg-[#0066ff] hover:text-white transition-all">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {socialMedia?.facebook && (
                                        <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center text-[#0066ff] hover:bg-[#0066ff] hover:text-white transition-all">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {socialMedia?.instagram && (
                                        <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center text-[#0066ff] hover:bg-[#0066ff] hover:text-white transition-all">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                            </svg>
                                        </a>
                                    )}
                                    {socialMedia?.youtube && (
                                        <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center text-[#0066ff] hover:bg-[#0066ff] hover:text-white transition-all">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/>
                                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white"/>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Frequently Asked <span className="text-[#0066ff]">Questions</span>
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600">
                                Quick answers to common questions about services and consultations.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {contactFAQsData.map((faq, index) => (
                                <details key={index} className="bg-gray-50 rounded-2xl border-2 border-gray-100 group">
                                    <summary className="p-6 cursor-pointer list-none flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#0066ff] transition-transform group-open:rotate-180">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </summary>
                                    <div className="px-6 pb-6">
                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Location/Map Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Visit <span className="text-[#0066ff]">My Office</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600">
                            Located in the heart of the medical district, easily accessible by public transit.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100">
                        {/* Map Placeholder */}
                        <div className="h-96 bg-linear-to-br from-[#f0f9ff] to-[#e0f2fe] flex items-center justify-center">
                            <div className="text-center px-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </div>
                                {profile?.location ? (
                                    <>
                                        <p className="text-gray-900 font-medium text-lg mb-2">{profile.location}</p>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location)}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-block mt-4 text-[#0066ff] font-medium hover:underline"
                                        >
                                            Get Directions →
                                        </a>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Loading location...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
