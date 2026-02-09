"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import toast from "react-hot-toast";

export default function VerifyCoursePaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const reference = searchParams.get('reference');
        
        if (!reference) {
            setStatus('failed');
            setMessage('Payment reference not found');
            return;
        }

        // Verify payment
        courseService.verifyCoursePayment(reference)
            .then((data) => {
                setStatus('success');
                setMessage(data?.message || 'Course purchased successfully!');
                toast.success('Payment verified successfully!');
                
                // Redirect to my courses after 3 seconds
                setTimeout(() => {
                    router.push('/dashboard/courses');
                }, 3000);
            })
            .catch((err: unknown) => {
                setStatus('failed');
                const error = err as { message?: string; response?: { data?: { message?: string } } };
                const errorMessage = error?.message || error?.response?.data?.message || 'Payment verification failed';
                setMessage(errorMessage);
                toast.error(errorMessage);
            });
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center border border-gray-200">
                {status === 'verifying' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
                        <p className="text-gray-600">Please wait while we confirm your payment...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <polyline points="20 6 9 17 4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <p className="text-sm text-gray-500 mb-6">Redirecting to your courses...</p>
                        <Link href="/dashboard/courses">
                            <button className="px-6 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                Go to My Courses
                            </button>
                        </Link>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="6" y1="6" x2="18" y2="18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="flex gap-3">
                            <Link href="/dashboard/browse-courses" className="flex-1">
                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                    Browse Courses
                                </button>
                            </Link>
                            <Link href="/dashboard" className="flex-1">
                                <button className="w-full px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                    Go to Dashboard
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
