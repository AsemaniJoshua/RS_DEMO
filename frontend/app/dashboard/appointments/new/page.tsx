"use client";

import { useState } from "react";
import Link from "next/link";

export default function NewAppointmentPage() {
    const [formData, setFormData] = useState({
        type: "",
        date: "",
        time: "",
        mode: "Virtual",
        notes: ""
    });

    const appointmentTypes = [
        "Drug Consultation",
        "Health Assessment",
        "Follow-up",
        "Initial Consultation",
        "Medication Review"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Booking appointment:", formData);
        // Handle booking logic here
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <Link href="/dashboard/appointments" className="text-[#0066ff] hover:underline mb-2 inline-block">
                    ← Back to Appointments
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Book New Appointment</h1>
                <p className="text-gray-600">Schedule a consultation with Dr. George</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="space-y-6">
                            {/* Appointment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                >
                                    <option value="">Select appointment type</option>
                                    {appointmentTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferred Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                                />
                            </div>

                            {/* Mode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Consultation Mode <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mode: "Virtual" })}
                                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                            formData.mode === "Virtual"
                                                ? "border-[#0066ff] bg-blue-50 text-[#0066ff]"
                                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <rect x="2" y="7" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="17 2 12 7 7 2" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            Virtual
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, mode: "In-Person" })}
                                        className={`px-4 py-3 rounded-lg border-2 transition-all ${
                                            formData.mode === "In-Person"
                                                ? "border-[#0066ff] bg-blue-50 text-[#0066ff]"
                                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            In-Person
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={4}
                                    placeholder="Any specific concerns or questions you'd like to discuss..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none resize-none"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <Link href="/dashboard/appointments" className="flex-1">
                                    <button
                                        type="button"
                                        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Booking Information
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-[#0066ff] mt-0.5">•</span>
                                <span>Appointments are subject to availability</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#0066ff] mt-0.5">•</span>
                                <span>You'll receive confirmation within 24 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#0066ff] mt-0.5">•</span>
                                <span>Virtual consultations include a meeting link</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#0066ff] mt-0.5">•</span>
                                <span>Cancel or reschedule up to 24 hours before</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
                        <p className="text-sm text-gray-600 mb-4">If you have questions about booking, feel free to contact us.</p>
                        <Link href="/contact">
                            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                Contact Support
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
