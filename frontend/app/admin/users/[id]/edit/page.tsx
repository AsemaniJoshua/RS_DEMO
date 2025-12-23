"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import usersData from "@/data/admin/users.json";

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = parseInt(params.id as string);

    const user = usersData.users.find(u => u.id === userId);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "Patient",
        status: user?.status || "Active"
    });

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
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (changePassword && passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Updated user:", formData);
        if (changePassword) {
            console.log("New password set");
        }
        router.push("/admin/users");
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    if (!user) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
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
                            {getInitials(user.name)}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                                <span className="text-gray-600">Joined: {formatDate(user.joinedDate)}</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-600">{user.coursesEnrolled} Courses</span>
                                <span className="text-gray-600">•</span>
                                <span className="text-gray-600">{user.appointmentsBooked} Appointments</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Personal Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        
                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., John Doe"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
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
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+1 (555) 123-4567"
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
                                    {usersData.roles.filter(r => r !== "All Roles").map((role, idx) => (
                                        <option key={idx} value={role}>{role}</option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">Select the user's permission level</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Account Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    {usersData.statuses.filter(s => s !== "All Statuses").map((status, idx) => (
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
                                    <li>• <strong>Admin:</strong> Full access to all features and settings</li>
                                    <li>• <strong>Editor:</strong> Can create and manage content</li>
                                    <li>• <strong>Subscriber:</strong> Access to premium content and courses</li>
                                    <li>• <strong>Patient:</strong> Book appointments and view medical content</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            Update User
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
