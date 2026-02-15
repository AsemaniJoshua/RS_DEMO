"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { appointmentService } from "@/services/appointment-service";
import toast from "react-hot-toast";

export default function NewAppointmentPage() {
    const router = useRouter();
    const [types, setTypes] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        typeId: "",
        date: "",
        time: "",
        duration: "30 min",
        status: "SCHEDULED",
        reason: "",
        notes: ""
    });

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await appointmentService.getAdminTypes();
                setTypes(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, typeId: data[0].id }));
                }
            } catch (error) {
                console.error("Failed to fetch types:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTypes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate date is in the future
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
            toast.error("Appointment date must be in the future");
            return;
        }
        
        setIsSubmitting(true);
        try {
            await appointmentService.create(formData);
            toast.success("Appointment created successfully");
            router.push("/admin/appointments");
        } catch (error) {
            console.error("Failed to create appointment:", error);
            toast.error("Failed to create appointment. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
                    <p className="text-gray-600">Create a new patient appointment</p>
                </div>
                <Link href="/admin/appointments">
                    <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
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
                                    name="typeId"
                                    value={formData.typeId}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                >
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
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
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
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
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., 30 min, 1 hour, 45 min"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: "30 min", "1 hour", etc.</p>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Reason of Appointment <span className="text-red-500">*</span>
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
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                "Schedule Appointment"
                            )}
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
