"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth-service";

function VerifyOTPPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Email is missing. Please restart the password reset process.");
            return;
        }

        if (!otp) {
            toast.error("Please enter the verification code");
            return;
        }

        try {
            setLoading(true);
            await authService.verifyOTP(email, otp);
            toast.success("OTP verified!");
            // Navigate to reset password page with email and otp
            router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
        } catch (error: any) {
            toast.error(error.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter the 6-digit code sent to {email ? <span className="font-medium text-gray-900">{email}</span> : "your email"}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            Verification Code
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength={6}
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 text-center text-2xl tracking-widest appearance-none block w-full px-3 py-4 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-[#0066ff] focus:border-[#0066ff] sm:text-lg"
                            placeholder="• • • • • •"
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Didn't receive code?</span>
                        <Link 
                            href="/forgot-password"
                            className="font-medium text-[#0066ff] hover:text-[#0052cc]"
                        >
                            Resend Code
                        </Link>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0066ff] hover:bg-[#0052cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066ff] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <Link href="/login" className="font-medium text-sm text-[#0066ff] hover:text-[#0052cc] transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyOTPPageContent />
        </Suspense>
    );
}
