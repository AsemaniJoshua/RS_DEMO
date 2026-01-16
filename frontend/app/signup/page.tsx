"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { signup } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!agreeTerms) {
            setError("You must agree to the Terms of Service and Privacy Policy");
            return;
        }

        setIsLoading(true);

        try {
            // Map form data to API expected format
            await signup({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
            
            setSuccess(true);
            // Redirect to login after successful signup
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 sm:p-8">
                <div className="max-w-md w-full py-4">
                    {/* Logo/Brand */}
                    <div className="mb-3">
                        <h2 className=" text-3xl font-bold text-gray-900">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Join us to start your health journey
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-600">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <p className="text-sm text-green-800 font-medium">Account created successfully! Redirecting to login...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-600">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <p className="text-sm text-red-800 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors"
                                    placeholder="John"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors"
                                placeholder="Min 8 characters"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors"
                                placeholder="Confirm password"
                            />
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="h-4 w-4 text-[#0066ff] border-gray-300 rounded focus:ring-[#0066ff] cursor-pointer"
                                />
                            </div>
                            <div className="ml-2 text-sm">
                                <label htmlFor="terms" className="text-gray-600 cursor-pointer">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#0066ff] hover:text-[#0052cc]">
                                        Terms of Service
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-[#0066ff] hover:text-[#0052cc]">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Check if have Account */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-[#0066ff] hover:text-[#0052cc] transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Brand Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066ff] to-[#00bfa6] items-center justify-center p-12 relative min-h-screen lg:fixed lg:right-0 lg:top-0 lg:bottom-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-white">
                    <div className="mb-8">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                            <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                            <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        Join Our Community
                    </h1>

                    <p className="text-lg text-white/90 mb-8 leading-relaxed">
                        Create an account today to access personalized features, track your progress, and get the expert support you need.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4">
                        {[
                            "Track your medication history",
                            "Book appointments with specialists",
                            "Access exclusive educational courses",
                            "Secure and private health records"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <span className="text-white/90">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Back to Home Link */}
                    <div className="mt-12">
                        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
