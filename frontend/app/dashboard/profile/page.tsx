"use client";

import { useState, useEffect } from "react";
import { profileService, UserProfile } from "@/services/profile-service";
import toast from "react-hot-toast";

const InputField = ({ label, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
            {...props}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-600 ${props.className || ''}`}
        />
    </div>
);

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phoneNumber: "",
        email: ""
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setUser(data);
            setFormData({
                first_name: data.first_name,
                last_name: data.last_name,
                phoneNumber: data.phoneNumber || "",
                email: data.email
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast.error("Failed to load profile data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await profileService.updateProfile({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phoneNumber: formData.phoneNumber
            });
            toast.success("Profile updated successfully");
            setIsEditing(false);
            fetchProfile(); // Refresh data
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to update profile");
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            setIsChangingPassword(true);
            await profileService.updateProfile(passwordData);
            toast.success("Password changed successfully");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your personal information and settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white text-3xl font-bold mb-4">
                                {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="mt-4">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {user.subscription} Member
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-gray-200 pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Member Since</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Courses Enrolled</span>
                                <span className="text-sm font-semibold text-gray-900">{user.stats?.coursesEnrolled || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Upcoming Appointments</span>
                                <span className="text-sm font-semibold text-gray-900">{user.stats?.upcomingAppointments || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Hours</span>
                                <span className="text-sm font-semibold text-gray-900">{user.stats?.totalLearningHours || 0}h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-sm font-medium cursor-pointer"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-sm font-medium cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled={true} // Email usually not editable directly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none disabled:bg-gray-50 disabled:text-gray-600 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
                        <div className="space-y-4">
                            <InputField 
                                label="Current Password"
                                type="password"
                                placeholder="Enter current password"
                                value={passwordData.currentPassword}
                                onChange={(e: any) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                            <InputField 
                                label="New Password"
                                type="password"
                                placeholder="Enter new password"
                                value={passwordData.newPassword}
                                onChange={(e: any) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                            <InputField 
                                label="Confirm New Password"
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={(e: any) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                            <button 
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isChangingPassword ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
