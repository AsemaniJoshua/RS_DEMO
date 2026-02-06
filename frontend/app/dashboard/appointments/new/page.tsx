
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
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
        reason: "",
        notes: ""
    });

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await appointmentService.getAllTypes();
                setTypes(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, typeId: data[0].id }));
                }
            } catch (error) {
                toast.error("Failed to fetch appointment types");
            } finally {
                setLoading(false);
            }
        };
        fetchTypes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            // Only send the fields required by backend
            const payload = {
                patientName: formData.patientName,
                patientEmail: formData.patientEmail,
                patientPhone: formData.patientPhone,
                typeId: formData.typeId,
                date: formData.date,
                time: formData.time,
                duration: formData.duration,
                reason: formData.reason,
                notes: formData.notes
            };
            await appointmentService.createMyAppointment(payload);
            toast.success("Appointment booked successfully");
            router.push("/dashboard/appointments");
        } catch (error: any) {
            toast.error(error.message || "Failed to book appointment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <BackButton href="/dashboard/appointments" label="Back" className="mb-0" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book New Appointment</h1>
                    <p className="text-gray-600">Schedule a consultation with Dr. George</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                    {/* Patient Information Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Full Name <span className="text-red-500">*</span>
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
                        <div className="mb-4">
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
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Add any additional notes about the appointment..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none resize-none text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Booking..." : "Book Appointment"}
                        </button>
                        <BackButton href="/dashboard/appointments" label="Cancel" className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium" />
                    </div>
                </div>
            </form>
        </div>
    );
}
