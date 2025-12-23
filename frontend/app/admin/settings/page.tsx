"use client";

import { useState } from "react";
import settingsData from "@/data/admin/settings.json";

type TabType = "general" | "notifications" | "security" | "payment" | "appointments" | "advanced";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [hasChanges, setHasChanges] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState(settingsData.general);
    
    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState(settingsData.notifications);
    
    // Security Settings
    const [securitySettings, setSecuritySettings] = useState(settingsData.security);
    
    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState(settingsData.payment);
    
    // Appointment Settings
    const [appointmentSettings, setAppointmentSettings] = useState(settingsData.appointments);
    
    // Advanced Settings
    const [advancedSettings, setAdvancedSettings] = useState(settingsData.advanced);

    const handleSave = () => {
        console.log("Saving settings:", {
            general: generalSettings,
            notifications: notificationSettings,
            security: securitySettings,
            payment: paymentSettings,
            appointments: appointmentSettings,
            advanced: advancedSettings
        });
        setHasChanges(false);
        alert("Settings saved successfully!");
    };

    const handleReset = () => {
        setGeneralSettings(settingsData.general);
        setNotificationSettings(settingsData.notifications);
        setSecuritySettings(settingsData.security);
        setPaymentSettings(settingsData.payment);
        setAppointmentSettings(settingsData.appointments);
        setAdvancedSettings(settingsData.advanced);
        setHasChanges(false);
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage platform configuration and preferences</p>
                </div>
                {hasChanges && (
                    <div className="flex gap-3">
                        <button
                            onClick={handleReset}
                            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === "general"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab("notifications")}
                    className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === "notifications"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Notifications
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === "security"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Security
                </button>
                <button
                    onClick={() => setActiveTab("payment")}
                    className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === "payment"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Payment
                </button>
                <button
                    onClick={() => setActiveTab("appointments")}
                    className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === "appointments"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setActiveTab("advanced")}
                    className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                        activeTab === "advanced"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Advanced
                </button>
            </div>

            {/* General Settings Tab */}
            {activeTab === "general" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={generalSettings.siteName}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, siteName: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Site Tagline</label>
                            <input
                                type="text"
                                value={generalSettings.siteTagline}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, siteTagline: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Email</label>
                            <input
                                type="email"
                                value={generalSettings.contactEmail}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, contactEmail: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Support Email</label>
                            <input
                                type="email"
                                value={generalSettings.supportEmail}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, supportEmail: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={generalSettings.phoneNumber}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Timezone</label>
                            <select
                                value={generalSettings.timezone}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, timezone: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                            <input
                                type="text"
                                value={generalSettings.address}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, address: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Language</label>
                            <select
                                value={generalSettings.language}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, language: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Currency</label>
                            <select
                                value={generalSettings.currency}
                                onChange={(e) => {
                                    setGeneralSettings({ ...generalSettings, currency: e.target.value });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="CAD">CAD ($)</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Email Notifications</div>
                                <div className="text-sm text-gray-600">Receive all notifications via email</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.emailNotifications}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">New Appointment Alerts</div>
                                <div className="text-sm text-gray-600">Get notified when new appointments are booked</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.newAppointmentAlert}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, newAppointmentAlert: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Course Enrollment Alerts</div>
                                <div className="text-sm text-gray-600">Notifications for new course enrollments</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.courseEnrollmentAlert}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, courseEnrollmentAlert: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">New Message Alerts</div>
                                <div className="text-sm text-gray-600">Get notified for new messages</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.newMessageAlert}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, newMessageAlert: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Weekly Report</div>
                                <div className="text-sm text-gray-600">Receive weekly analytics report</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.weeklyReport}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, weeklyReport: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">SMS Notifications</div>
                                <div className="text-sm text-gray-600">Receive notifications via text message</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.smsNotifications}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Push Notifications</div>
                                <div className="text-sm text-gray-600">Browser push notifications</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={notificationSettings.pushNotifications}
                                    onChange={(e) => {
                                        setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Two-Factor Authentication</div>
                                <div className="text-sm text-gray-600">Require 2FA for all admin accounts</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={securitySettings.twoFactorAuth}
                                    onChange={(e) => {
                                        setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Session Timeout (minutes)</label>
                                <input
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => {
                                        setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Password Expiry (days)</label>
                                <input
                                    type="number"
                                    value={securitySettings.passwordExpiry}
                                    onChange={(e) => {
                                        setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Max Login Attempts</label>
                                <input
                                    type="number"
                                    value={securitySettings.loginAttempts}
                                    onChange={(e) => {
                                        setSecuritySettings({ ...securitySettings, loginAttempts: parseInt(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Force HTTPS</div>
                                <div className="text-sm text-gray-600">Enforce secure HTTPS connections</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={securitySettings.forceHttps}
                                    onChange={(e) => {
                                        setSecuritySettings({ ...securitySettings, forceHttps: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">API Access Logging</div>
                                <div className="text-sm text-gray-600">Log all API access attempts</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={securitySettings.apiAccessLog}
                                    onChange={(e) => {
                                        setSecuritySettings({ ...securitySettings, apiAccessLog: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Test Mode</div>
                                <div className="text-sm text-gray-600">Use test payment credentials</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={paymentSettings.testMode}
                                    onChange={(e) => {
                                        setPaymentSettings({ ...paymentSettings, testMode: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Gateway</label>
                                <select
                                    value={paymentSettings.paymentGateway}
                                    onChange={(e) => {
                                        setPaymentSettings({ ...paymentSettings, paymentGateway: e.target.value });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    <option value="Stripe">Stripe</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="Square">Square</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={paymentSettings.taxRate}
                                    onChange={(e) => {
                                        setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Stripe Publishable Key</label>
                                <input
                                    type="text"
                                    value={paymentSettings.stripePubKey}
                                    onChange={(e) => {
                                        setPaymentSettings({ ...paymentSettings, stripePubKey: e.target.value });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Stripe Secret Key</label>
                                <input
                                    type="password"
                                    value={paymentSettings.stripeSecretKey}
                                    onChange={(e) => {
                                        setPaymentSettings({ ...paymentSettings, stripeSecretKey: e.target.value });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">PayPal Integration</div>
                                <div className="text-sm text-gray-600">Enable PayPal payment option</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={paymentSettings.paypalEnabled}
                                    onChange={(e) => {
                                        setPaymentSettings({ ...paymentSettings, paypalEnabled: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Appointment Settings</h2>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Booking Buffer (hours)</label>
                            <input
                                type="number"
                                value={appointmentSettings.bookingBuffer}
                                onChange={(e) => {
                                    setAppointmentSettings({ ...appointmentSettings, bookingBuffer: parseInt(e.target.value) });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                            <p className="text-sm text-gray-500 mt-1">Minimum hours before appointment</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Max Advance Booking (days)</label>
                            <input
                                type="number"
                                value={appointmentSettings.maxAdvanceBooking}
                                onChange={(e) => {
                                    setAppointmentSettings({ ...appointmentSettings, maxAdvanceBooking: parseInt(e.target.value) });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                            <p className="text-sm text-gray-500 mt-1">How far in advance users can book</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Default Duration (minutes)</label>
                            <input
                                type="number"
                                value={appointmentSettings.appointmentDuration}
                                onChange={(e) => {
                                    setAppointmentSettings({ ...appointmentSettings, appointmentDuration: parseInt(e.target.value) });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Reminder Time (hours before)</label>
                            <input
                                type="number"
                                value={appointmentSettings.reminderTime}
                                onChange={(e) => {
                                    setAppointmentSettings({ ...appointmentSettings, reminderTime: parseInt(e.target.value) });
                                    setHasChanges(true);
                                }}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Allow Cancellation</div>
                                <div className="text-sm text-gray-600">Let patients cancel appointments</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={appointmentSettings.allowCancellation}
                                    onChange={(e) => {
                                        setAppointmentSettings({ ...appointmentSettings, allowCancellation: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Auto-Confirmation</div>
                                <div className="text-sm text-gray-600">Automatically confirm new appointments</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={appointmentSettings.autoConfirmation}
                                    onChange={(e) => {
                                        setAppointmentSettings({ ...appointmentSettings, autoConfirmation: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Advanced Tab */}
            {activeTab === "advanced" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Advanced Settings</h2>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-600 flex-shrink-0 mt-0.5">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <div className="text-sm text-yellow-900">
                                <div className="font-semibold mb-1">Warning:</div>
                                <div className="text-yellow-700">These settings affect core system functionality. Only modify if you know what you're doing.</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Maintenance Mode</div>
                                <div className="text-sm text-gray-600">Disable public access to the site</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={advancedSettings.maintenanceMode}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, maintenanceMode: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Debug Mode</div>
                                <div className="text-sm text-gray-600">Show detailed error messages</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={advancedSettings.debugMode}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, debugMode: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-semibold text-gray-900">Cache Enabled</div>
                                <div className="text-sm text-gray-600">Use caching for better performance</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={advancedSettings.cacheEnabled}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, cacheEnabled: e.target.checked });
                                        setHasChanges(true);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d4aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d4aa]"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">API Rate Limit (requests/hour)</label>
                                <input
                                    type="number"
                                    value={advancedSettings.apiRateLimit}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, apiRateLimit: parseInt(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Cache Duration (seconds)</label>
                                <input
                                    type="number"
                                    value={advancedSettings.cacheDuration}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, cacheDuration: parseInt(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Backup Frequency</label>
                                <select
                                    value={advancedSettings.backupFrequency}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, backupFrequency: e.target.value });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Data Retention (days)</label>
                                <input
                                    type="number"
                                    value={advancedSettings.dataRetention}
                                    onChange={(e) => {
                                        setAdvancedSettings({ ...advancedSettings, dataRetention: parseInt(e.target.value) });
                                        setHasChanges(true);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button at Bottom (Always Visible) */}
            {hasChanges && (
                <div className="sticky bottom-8 flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium shadow-lg"
                    >
                        Reset Changes
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium shadow-lg"
                    >
                        Save All Settings
                    </button>
                </div>
            )}
        </div>
    );
}
