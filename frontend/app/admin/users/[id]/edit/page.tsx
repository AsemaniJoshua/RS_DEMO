"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { usersService, User } from "@/services/users-service";
import { ApiError } from "@/lib/api";

// Role and status options
const roles = ["ADMIN", "PATIENT", "EDITOR"];
const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phoneNumber: "",
        role: "PATIENT",
        account_status: "ACTIVE"
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                // Note: Since we don't have a get-user-by-id endpoint yet, we fetch all and find
                const response = await usersService.getAllUsers();
                const foundUser = response.data?.find(u => u.id === userId);
                
                if (foundUser) {
                    setUser(foundUser);
                    setFormData({
                        first_name: foundUser.first_name,
                        last_name: foundUser.last_name,
                        email: foundUser.email,
                        phoneNumber: foundUser.phoneNumber,
                        role: foundUser.role,
                        account_status: foundUser.account_status
                    });
                } else {
                    setError("User not found");
                }
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load user");
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const [changePassword, setChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (changePassword && passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (changePassword && passwordData.newPassword.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setIsSubmitting(true);

        try {
            // Update user details
            await usersService.updateUserById(userId, formData);

            // TODO: Handle password update if API supports it in a separate call or same call
            // Currently assuming updateUserById handles basic details
            
            router.push("/admin/users");
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Failed to update user");
            setIsSubmitting(false);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
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

    if (error && !user) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link href="/admin/users">
                        <button className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors">
                            Back to Users
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
                    <p className="text-gray-600">Update user information and permissions</p>
                </div>
                <Link href="/admin/users">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                    {/* User Summary Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] flex items-center justify-center text-white text-2xl font-bold">
                                {getInitials(user!.first_name, user!.last_name)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">{user!.first_name} {user!.last_name}</h3>
                                <p className="text-gray-600">{user!.email}</p>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Created: {formatDate(user!.created_at)}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-gray-600">Role: {user!.role}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className="text-gray-600">Status: {user!.account_status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Personal Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        
                        {/* First and Last Name */}
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., John"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Doe"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="user@email.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="1234567890"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* Account Settings Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                        
                        {/* Role and Status */}
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    User Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    {roles.map((role, idx) => (
                                        <option key={idx} value={role}>{role}</option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">Select the user&apos;s permission level</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Account Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="account_status"
                                    value={formData.account_status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    {statuses.map((status, idx) => (
                                        <option key={idx} value={status}>{status}</option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">Set the account status</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* Password Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Settings</h3>
                        
                        <div className="mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={changePassword}
                                    onChange={(e) => setChangePassword(e.target.checked)}
                                    className="w-4 h-4 text-[#00d4aa] border-gray-300 rounded focus:ring-[#00d4aa]"
                                />
                                <span className="text-sm font-medium text-gray-900">Change Password</span>
                            </label>
                        </div>

                        {changePassword && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        New Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required={changePassword}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Minimum 8 characters</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Confirm New Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required={changePassword}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Role Information Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600 flex-shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <div className="text-sm text-blue-900">
                                <div className="font-semibold mb-1">User Role Permissions:</div>
                                <ul className="space-y-1 text-blue-700">
                                    <li>• <strong>ADMIN:</strong> Full access to all features and settings</li>
                                    <li>• <strong>EDITOR:</strong> Can create and manage content</li>
                                    <li>• <strong>PATIENT:</strong> Book appointments and view medical content</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </button>
                        <Link href="/admin/users">
                            <button
                                type="button"
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
