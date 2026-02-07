"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ebookService, type Ebook } from "@/services/ebook-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Download, 
    ShoppingCart, 
    BookOpen, 
    Calendar, 
    FileText, 
    Globe, 
    Tag,
    User,
    CheckCircle,
    AlertCircle
} from "lucide-react";

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
            if (!ebook.price || Number(ebook.price) === 0) {
                // Free ebook: call free purchase endpoint
                await ebookService.freePurchaseEbook(id);
                toast.success('Ebook added to your library!');
                setIsPurchased(true);
            } else {
                // Paid ebook: normal payment flow
                const callbackUrl = `${window.location.origin}/dashboard/ebooks/${id}`;
                const response = await ebookService.purchaseEbook(id, callbackUrl);
                if (response.data?.authorization_url) {
                    window.location.href = response.data.authorization_url;
                } else {
                    toast.error('Failed to initialize payment');
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'Purchase failed');
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
            setProcessingPayment(true);
            const response = await ebookService.downloadEbook(id);
            if (response.data?.downloadUrl) {
                // Force download using a temporary anchor element
                const link = document.createElement('a');
                link.href = response.data.downloadUrl;
                link.download = ebook?.title?.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf' || 'ebook.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Download starting...');
            } else {
                toast.error('Download link not available.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to download ebook');
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading || verifying) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">{verifying ? 'Verifying payment...' : 'Loading ebook details...'}</p>
                </div>
            </div>
        );
    }

    if (!ebook) return null;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    href="/dashboard/ebooks"
                    className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Cover Image Banner */}
            <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="relative h-64 md:h-[400px] w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {ebook.coverImage ? (
                        <img 
                            src={ebook.coverImage} 
                            alt={ebook.title} 
                            className="h-full w-auto object-contain shadow-2xl"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <BookOpen className="w-20 h-20 mb-3 opacity-50" />
                            <span className="text-sm font-medium">No cover image available</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title & Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        {ebook.category?.name || 'Education'}
                                    </span>
                                    {isPurchased && (
                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-100 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Purchased
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{ebook.title}</h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <User className="w-5 h-5" />
                                    <span className="text-lg font-medium">by {ebook.author}</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {ebook.price > 0 ? `GHS ${ebook.price}` : <span className="text-green-600">Free</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Published</div>
                                    <div className="font-bold text-gray-900">
                                        {ebook.created_at ? new Date(ebook.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Pages</div>
                                    <div className="font-bold text-gray-900">{ebook.pages || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-orange-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Format</div>
                                    <div className="font-bold text-gray-900">{ebook.format || 'PDF'}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-green-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Language</div>
                                    <div className="font-bold text-gray-900">English</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#00d4aa]" />
                            About This Book
                        </h3>
                        <div className="prose prose-sm prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {ebook.description || 'No description available.'}
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-6 md:p-8">
                        {isPurchased ? (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to Download</h3>
                                <p className="text-gray-600 mb-6">
                                    You own this ebook. Click below to download it to your device.
                                </p>
                                <button 
                                    onClick={handleDownload}
                                    disabled={processingPayment}
                                    className="w-full bg-[#00d4aa] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#00bfa6] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-5 h-5" />
                                    {processingPayment ? 'Preparing Download...' : 'Download Ebook'}
                                </button>
                            </>
                        ) : ebook.status !== 'PUBLISHED' ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-yellow-900 mb-2">Unavailable for Purchase</h3>
                                    <p className="text-yellow-800">This ebook is currently not available for purchase.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Get This Book</h3>
                                <p className="text-gray-600 mb-6">
                                    {(!ebook.price || Number(ebook.price) === 0) 
                                        ? 'This ebook is free! Add it to your library now.' 
                                        : `Purchase this ebook for GHS ${ebook.price} and download it instantly.`}
                                </p>
                                <button 
                                    onClick={handlePurchase}
                                    disabled={processingPayment}
                                    className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processingPayment ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            {(!ebook.price || Number(ebook.price) === 0) ? 'Get for Free' : `Buy Now - GHS ${ebook.price}`}
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Book Details</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Category
                                </label>
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900">{ebook.category?.name || 'Education'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Author
                                </label>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-500" />
                                    <span className="font-medium text-gray-900">{ebook.author}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Format
                                </label>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium text-gray-900">{ebook.format || 'PDF'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Published
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 font-medium">
                                        {ebook.created_at ? new Date(ebook.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {isPurchased && (
                                <>
                                    <div className="h-px bg-gray-100"></div>
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
                                            <CheckCircle className="w-5 h-5" />
                                            In Your Library
                                        </div>
                                        <p className="text-sm text-green-600">You own this ebook</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
