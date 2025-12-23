"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import appointmentsData from "@/data/admin/appointments.json";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditAppointmentPage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = parseInt(params.id as string);

    const appointment = appointmentsData.appointments.find(a => a.id === appointmentId);

    const [formData, setFormData] = useState({
        patientName: appointment?.patientName || "",
        patientEmail: appointment?.patientEmail || "",
        patientPhone: appointment?.patientPhone || "",
        type: appointment?.type || "Consultation",
        date: appointment?.date || "",
        time: appointment?.time || "",
        duration: appointment?.duration || "30 min",
        status: appointment?.status || "Scheduled",
        reason: appointment?.reason || "",
        notes: appointment?.notes || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Updated appointment:", formData);
        router.push("/admin/appointments");
    };

    if (!appointment) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Not Found</h2>
                    <p className="text-gray-600 mb-4">The appointment you're looking for doesn't exist.</p>
                    <Link href="/admin/appointments">
                        <button className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors">
                            Back to Appointments
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Appointment</h1>
                    <p className="text-gray-600">Update appointment information</p>
                </div>
                <Link href="/admin/appointments">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                {/* Appointment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Appointment Summary</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <div className="text-lg font-bold text-gray-900">{appointment.patientName}</div>
                            <div className="text-xs text-gray-600">Patient</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-600">Date</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-gray-900">{appointment.time}</div>
                            <div className="text-xs text-gray-600">Time</div>
                        </div>
                        <div>
                            <div className={`text-lg font-bold ${
                                appointment.status === "Scheduled" ? "text-blue-600" :
                                appointment.status === "Confirmed" ? "text-green-600" :
                                appointment.status === "Completed" ? "text-purple-600" :
                                appointment.status === "Cancelled" ? "text-red-600" :
                                "text-gray-600"
                            }`}>
                                {appointment.status}
                            </div>
                            <div className="text-xs text-gray-600">Status</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Patient Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                        
                        {/* Patient Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Patient Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Sarah Johnson"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleChange}
                                    required
                                    placeholder="patient@email.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    value={formData.patientPhone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* Appointment Details Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
                        
                        {/* Type and Status */}
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Appointment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    {appointmentsData.types.filter(t => t !== "All Types").map((type, idx) => (
                                        <option key={idx} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    {appointmentsData.statuses.filter(s => s !== "All Statuses").map((status, idx) => (
                                        <option key={idx} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date, Time, and Duration */}
                        <div className="grid grid-cols-3 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Duration <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                >
                                    <option value="15 min">15 minutes</option>
                                    <option value="20 min">20 minutes</option>
                                    <option value="30 min">30 minutes</option>
                                    <option value="45 min">45 minutes</option>
                                    <option value="60 min">1 hour</option>
                                </select>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Reason for Visit <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Discuss new diabetes medication"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Additional Notes
                            </label>
                            <RichTextEditor
                                value={formData.notes}
                                onChange={(value) => setFormData({ ...formData, notes: value })}
                                placeholder="Add any additional notes about the appointment..."
                                minHeight="150px"
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            Update Appointment
                        </button>
                        <Link href="/admin/appointments">
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
