"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { liveSessionsService } from "@/services/live-sessions-service";
import toast from "react-hot-toast";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function RecordingVerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
    const [sessionTitle, setSessionTitle] = useState<string | null>(null);

    useEffect(() => {
        if (!reference) {
            toast.error("No payment reference provided.");
            router.replace("/dashboard/live-sessions");
            return;
        }
        verifyPayment();
        // eslint-disable-next-line
    }, [reference]);

    const verifyPayment = async () => {
        try {
            setLoading(true);
            const response = await liveSessionsService.verifyRecordingPurchase(reference!);
            if (response.data?.recording_url) {
                setSuccess(true);
                setRecordingUrl(response.data.recording_url);
                setSessionTitle(response.data.session_title);
            } else {
                setSuccess(false);
            }
        } catch (error: any) {
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                {loading ? (
                    <>
                        <Loader2 className="w-10 h-10 mx-auto text-blue-500 animate-spin mb-4" />
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Verifying Payment...</h2>
                        <p className="text-gray-600">Please wait while we verify your payment.</p>
                    </>
                ) : success ? (
                    <>
                        <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">You now have access to the recording{sessionTitle ? ` for "${sessionTitle}"` : ""}.</p>
                        {recordingUrl && (
                            <a
                                href={recordingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg"
                            >
                                Watch Recording
                            </a>
                        )}
                        <div className="mt-6">
                            <Link href="/dashboard/live-sessions" className="text-blue-600 hover:underline font-medium">
                                Back to Live Sessions
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <XCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Payment Verification Failed</h2>
                        <p className="text-gray-600 mb-4">We could not verify your payment. If you believe this is an error, please contact support.</p>
                        <div className="mt-6">
                            <Link href="/dashboard/live-sessions" className="text-blue-600 hover:underline font-medium">
                                Back to Live Sessions
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
