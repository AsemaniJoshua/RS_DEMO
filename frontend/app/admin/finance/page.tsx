"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type TabType = "courses" | "liveSessions" | "ebooks";

interface CourseTransaction {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    status: string;
    paymentReference: string;
    purchasedAt: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    course: {
        title: string;
    };
}

interface LiveSessionTransaction {
    id: string;
    userId: string;
    sessionId: string;
    amount: number;
    payment_status: string;
    payment_reference: string;
    purchased_at: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    session: {
        title: string;
    };
}

interface EbookTransaction {
    id: string;
    userId: string;
    ebookId: string;
    amount: number;
    status: string;
    paymentReference: string;
    purchasedAt: string;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    ebook: {
        title: string;
    };
}

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState<TabType>("courses");
    const [loading, setLoading] = useState(true);
    const [courseTransactions, setCourseTransactions] = useState<CourseTransaction[]>([]);
    const [liveSessionTransactions, setLiveSessionTransactions] = useState<LiveSessionTransaction[]>([]);
    const [ebookTransactions, setEbookTransactions] = useState<EbookTransaction[]>([]);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

    useEffect(() => {
        fetchTransactions();
    }, [activeTab]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('auth_token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            if (activeTab === "courses") {
                const response = await axios.get(`${API_BASE_URL}/admin/finance/courses`, getAuthHeader());
                setCourseTransactions(response.data.data || response.data.transactions || []);
            } else if (activeTab === "liveSessions") {
                const response = await axios.get(`${API_BASE_URL}/admin/finance/live-sessions`, getAuthHeader());
                setLiveSessionTransactions(response.data.data || response.data.transactions || []);
            } else if (activeTab === "ebooks") {
                const response = await axios.get(`${API_BASE_URL}/admin/finance/ebooks`, getAuthHeader());
                setEbookTransactions(response.data.data || response.data.transactions || []);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTotal = () => {
        if (activeTab === "courses") {
            return courseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        } else if (activeTab === "liveSessions") {
            return liveSessionTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        } else {
            return ebookTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Management</h1>
                <p className="text-gray-600">View all successful transactions across your platform</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 mb-6">
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab("courses")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "courses"
                                ? "text-[#00d4aa] border-b-2 border-[#00d4aa] bg-[#00d4aa]/5"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Course Sales</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("liveSessions")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "liveSessions"
                                ? "text-[#00d4aa] border-b-2 border-[#00d4aa] bg-[#00d4aa]/5"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Live Session Sales</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("ebooks")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "ebooks"
                                ? "text-[#00d4aa] border-b-2 border-[#00d4aa] bg-[#00d4aa]/5"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>eBook Sales</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-[#00d4aa] to-[#00bfa6] rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm mb-1">Total Revenue ({activeTab === "courses" ? "Courses" : activeTab === "liveSessions" ? "Live Sessions" : "eBooks"})</p>
                        <h2 className="text-3xl font-bold">{formatCurrency(calculateTotal())}</h2>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>
                            {activeTab === "courses" ? courseTransactions.length : 
                             activeTab === "liveSessions" ? liveSessionTransactions.length : 
                             ebookTransactions.length} successful transactions
                        </span>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4aa] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading transactions...</p>
                    </div>
                ) : (
                    <>
                        {/* Course Transactions */}
                        {activeTab === "courses" && (
                            <>
                                {courseTransactions.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Course Sales Yet</h3>
                                        <p className="text-gray-500">Course purchase transactions will appear here</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Course</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {courseTransactions.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{transaction.user.first_name} {transaction.user.last_name}</p>
                                                                <p className="text-sm text-gray-500">{transaction.user.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-gray-900">{transaction.course.title}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded">{transaction.paymentReference}</code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-600">{formatDate(transaction.purchasedAt)}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Live Session Transactions */}
                        {activeTab === "liveSessions" && (
                            <>
                                {liveSessionTransactions.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                                <path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Live Session Sales Yet</h3>
                                        <p className="text-gray-500">Recording purchase transactions will appear here</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Recording</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {liveSessionTransactions.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{transaction.user.first_name} {transaction.user.last_name}</p>
                                                                <p className="text-sm text-gray-500">{transaction.user.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-gray-900">{transaction.session.title}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded">{transaction.payment_reference}</code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-600">{formatDate(transaction.purchased_at)}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {transaction.payment_status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* eBook Transactions */}
                        {activeTab === "ebooks" && (
                            <>
                                {ebookTransactions.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No eBook Sales Yet</h3>
                                        <p className="text-gray-500">eBook purchase transactions will appear here</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">eBook</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {ebookTransactions.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{transaction.user.first_name} {transaction.user.last_name}</p>
                                                                <p className="text-sm text-gray-500">{transaction.user.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-gray-900">{transaction.ebook.title}</p>
                                                        </td>
                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="text-xs text-gray-800 bg-gray-100 px-2 py-1 rounded">{transaction.paymentReference}</code>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm text-gray-600">{formatDate(transaction.purchasedAt)}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
