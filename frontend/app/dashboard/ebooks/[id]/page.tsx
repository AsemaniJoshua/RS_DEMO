import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ebookService, type Ebook } from "@/services/ebook-service";
import BackButton from "@/components/ui/BackButton";
import toast from "react-hot-toast";

export default function EbookDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params.id as string;
    
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEbookDetails();
        }

        // Check for payment verification callback
        const reference = searchParams.get("reference");
        if (reference) {
            verifyPayment(reference);
        }
    }, [id, searchParams]);

    const fetchEbookDetails = async () => {
        try {
            setLoading(true);
            const response = await ebookService.getEbookById(id);
            setEbook(response.data?.ebook || null);
            setIsPurchased(response.data?.isPurchased || false);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load ebook details');
            router.push('/dashboard/ebooks');
        } finally {
            setLoading(false);
        }
    };

    const verifyPayment = async (reference: string) => {
        try {
            setVerifying(true);
            const toastId = toast.loading('Verifying payment...');
            await ebookService.verifyPurchase(reference);
            toast.success('Payment successful! You can now download the ebook.', { id: toastId });
            setIsPurchased(true);
            // Remove reference from URL
            router.replace(`/dashboard/ebooks/${id}`);
        } catch (error: any) {
             toast.error(error.message || 'Payment verification failed');
        } finally {
            setVerifying(false);
        }
    }

    const handlePurchase = async () => {
        if (!ebook) return;
        
        try {
            setProcessingPayment(true);
            const callbackUrl = `${window.location.origin}/dashboard/ebooks/${id}`;
            const response = await ebookService.purchaseEbook(id, callbackUrl);
            
            if (response.data?.authorization_url) {
                window.location.href = response.data.authorization_url;
            } else {
                toast.error('Failed to initialize payment');
            }
        } catch (error: any) {
            toast.error(error.message || 'Payment initialization failed');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleDownload = async () => {
        if (!isPurchased) {
             toast.error('Please purchase the ebook first');
             return;
        }

        try {
            const toastId = toast.loading('Preparing download...');
            const response = await ebookService.downloadEbook(id);
            toast.success('Download starting...', { id: toastId });
            
            if (response.data?.downloadUrl) {
                window.open(response.data.downloadUrl, '_blank');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to download ebook');
        }
    };

    if (loading || verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">{verifying ? 'Verifying payment...' : 'Loading ebook details...'}</p>
                </div>
            </div>
        );
    }

    if (!ebook) return null;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <BackButton href="/dashboard/ebooks" label="Back to Ebooks" />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row">
                    {/* Cover Image Section */}
                    <div className="w-full md:w-1/3 bg-gray-100 min-h-[400px] flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 p-8">
                         {ebook.coverImage ? (
                            <img 
                                src={ebook.coverImage} 
                                alt={ebook.title} 
                                className="w-48 h-auto shadow-xl rounded-sm"
                            />
                        ) : (
                            <div className="w-48 h-64 bg-white shadow-xl flex items-center justify-center text-gray-400">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-sm font-semibold text-[#0066ff] uppercase tracking-wide mb-2">
                                    {ebook.category?.name || 'Education'}
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{ebook.title}</h1>
                                <p className="text-xl text-gray-600 mb-4">by {ebook.author}</p>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {ebook.price > 0 ? `$${ebook.price}` : 'Free'}
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-600 mb-8 whitespace-pre-wrap">
                            <p>{ebook.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Published</div>
                                <div className="font-semibold text-gray-900">
                                    {ebook.created_at ? new Date(ebook.created_at).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Pages</div>
                                <div className="font-semibold text-gray-900">{ebook.pages}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Format</div>
                                <div className="font-semibold text-gray-900">{ebook.format || 'PDF'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Language</div>
                                <div className="font-semibold text-gray-900">English</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {isPurchased ? (
                                <button 
                                    onClick={handleDownload}
                                    className="flex-1 bg-[#0066ff] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    Download Ebook
                                </button>
                            ) : (
                                <button 
                                    onClick={handlePurchase}
                                    disabled={processingPayment}
                                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processingPayment ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Buy Now {ebook.price > 0 ? `($${ebook.price})` : '(Free)'}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
