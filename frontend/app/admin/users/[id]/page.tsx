"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { usersService, User } from "@/services/users-service";
import { ApiError } from "@/lib/api";
import toast from 'react-hot-toast';

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            if (!params.id) return;

            try {
                setIsLoading(true);
                const response = await usersService.getUserById(params.id as string);

                if (response.status === 'success' && response.data) {
                    setUser(response.data);
                } else {
                    throw new Error(response.message || 'Failed to load user details');
                }
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load user details");
                toast.error("Failed to load user details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-50 text-green-700";
            case "INACTIVE":
                return "bg-gray-100 text-gray-700";
            case "SUSPENDED":
                return "bg-red-50 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "bg-purple-50 text-purple-700";
            case "EDITOR":
                return "bg-blue-50 text-blue-700";
            case "PATIENT":
                return "bg-teal-50 text-teal-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-4 md:p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-800 font-medium">{error || "User not found"}</p>
                    <button 
                        onClick={() => router.back()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
                <Link href="/admin/users" className="hover:text-[#00d4aa] transition-colors">Users</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{user.first_name} {user.last_name}</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] flex items-center justify-center text-white text-3xl md:text-4xl font-bold shrink-0 shadow-lg ring-4 ring-white">
                    {getInitials(user.first_name, user.last_name)}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4 w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.first_name} {user.last_name}</h1>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                                    {user.role}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.account_status)}`}>
                                    {user.account_status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <Link href={`/admin/users/${user.id}/edit`}>
                                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Edit
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 justify-center md:justify-start text-gray-600 pt-2">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>Joined {formatDate(user.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Contact Information
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <div className="text-gray-900 font-medium flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                {user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                            <div className="text-gray-900 font-medium flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                                </svg>
                                {user.phoneNumber || 'Not provided'}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                                    <div className="text-gray-900 text-sm">{formatDate(user.created_at)}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                                    <div className="text-gray-900 text-sm">{formatDate(user.updated_at)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Settings / Meta */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Account Summary
                    </h2>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 font-medium">User ID</span>
                            <span className="text-xs text-gray-400 font-mono bg-white px-2 py-1 rounded border border-gray-200 select-all">{user.id}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            System identifier for this user.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.account_status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Account Status</div>
                                    <div className="text-xs text-gray-500">Current access level</div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.account_status)}`}>
                                {user.account_status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleBadgeColor(user.role).replace('text-', 'text-opacity-100 text-').replace('bg-', 'bg-opacity-20 bg-')}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 010 7.75"></path>
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">System Role</div>
                                    <div className="text-xs text-gray-500">Permission level</div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
