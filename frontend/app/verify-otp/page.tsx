"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6 && /^\d$/.test(char)) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        
        if (otpCode.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        setTimeout(() => {
            setIsLoading(false);
            if (otpCode === "123456") {
                router.push("/reset-password");
            } else {
                setError("Invalid verification code. Please try again.");
            }
        }, 1500);
    };

    const handleResend = () => {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
        setError("");
        inputRefs.current[0]?.focus();
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Brand & Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00d4aa] via-[#00bfa6] to-teal-600 p-12 flex-col justify-between relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 text-white">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.5"/>
                                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <span className="text-2xl font-bold">Dr. George</span>
                    </Link>
                </div>

                <div className="relative z-10">
                    <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Verify Your
                        <br />
                        Identity
                    </h2>
                    <p className="text-xl text-white/90 leading-relaxed max-w-md">
                        We've sent a 6-digit verification code to your email. Enter it below to proceed.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-8 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Private</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-block">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] rounded-xl flex items-center justify-center mx-auto mb-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.5"/>
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Verify Code</h1>
                        <p className="text-gray-600 text-lg">
                            Code sent to <span className="font-semibold text-gray-900">{email}</span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-4">
                                Enter 6-Digit Code
                            </label>
                            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {inputRefs.current[index] = el}}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ""))}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-16 sm:w-14 sm:h-18 text-center text-2xl font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-[#00d4aa] focus:ring-2 focus:ring-[#00d4aa]/20 outline-none transition-all text-gray-900"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-gray-500 text-center">
                                Code expires in 10 minutes
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.join("").length !== 6}
                            className="w-full py-4 bg-gradient-to-r from-[#00d4aa] to-[#00bfa6] text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-[#00d4aa]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </button>

                        <div className="text-center">
                            {resendTimer > 0 ? (
                                <p className="text-sm text-gray-600">
                                    Didn't receive the code?{" "}
                                    <span className="font-semibold text-gray-900">
                                        Resend in {resendTimer}s
                                    </span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-sm text-[#00d4aa] hover:underline font-semibold"
                                >
                                    Resend Code
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <Link 
                            href="/forgot-password" 
                            className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#00d4aa] transition-colors font-medium"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Change Email
                        </Link>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Demo code:{" "}
                        <span className="font-mono font-semibold text-[#00d4aa]">123456</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
