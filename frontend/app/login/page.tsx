"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api";
import toast from 'react-hot-toast';

function LoginContent() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');
    const { login, isAuthenticated, isAdminOrEditor, isLoading: isAuthLoading } = useAuth();

    // Redirect if already authenticated (only after auth loading is complete)
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            if (redirectUrl) {
                router.push(redirectUrl);
            } else if (isAdminOrEditor()) {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        }
    }, [isAuthLoading, isAuthenticated, isAdminOrEditor, router, redirectUrl]);

    // Show nothing while auth is loading or if authenticated (redirecting)
    if (isAuthLoading || isAuthenticated) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

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
        setIsLoading(true);

        try {
            await login(formData);
            // Redirect based on role after successful login
            // The useAuth hook will update, triggering the redirect above
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Login failed. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex">
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 overflow-y-auto">
                <div className="max-w-md w-full">
                    {/* Logo/Brand */}
                    <div className="mb-8">
                        <Link href="/" className="inline-block mb-4">
                            <div className="relative w-72 h-24">
                                <Image
                                    src="/rx-logo.png"
                                    alt="RxWithDrGeorge"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to access your account
                        </p>
                    </div>

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

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors text-gray-900"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 pr-12 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none transition-colors text-gray-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-[#0066ff] border-gray-300 rounded focus:ring-[#0066ff] cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <Link href="/forgot-password" className="text-sm font-medium text-[#0066ff] hover:text-[#0052cc] transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div> */}

                    {/* Social Login Buttons */}
                    {/* <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="h-12 px-4 rounded-lg border-2 border-gray-200 hover:border-[#0066ff] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className="h-12 px-4 rounded-lg border-2 border-gray-200 hover:border-[#0066ff] hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                        </button>
                    </div> */}

                    {/* Sign Up Link */}
                    {/* <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-[#0066ff] hover:text-[#0052cc] transition-colors">
                            Create an account
                        </Link>
                    </p> */}
                </div>
            </div>

            {/* Right Side - Text/Brand Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066ff] to-[#00bfa6] items-center justify-center p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg text-white">
                    <div className="mb-8">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        Your Health Journey Starts Here
                    </h1>

                    <p className="text-lg text-white/90 mb-8 leading-relaxed">
                        Access expert health guidance, personalized consultations, and evidence-based resources to optimize your wellness journey.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4">
                        {[
                            "Personalized medication reviews",
                            "Expert health consultations",
                            "Comprehensive wellness programs",
                            "24/7 access to resources"
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

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-10 h-10 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
