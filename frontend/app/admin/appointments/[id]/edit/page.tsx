"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { appointmentService } from "@/services/appointment-service";
import toast from "react-hot-toast";

export default function EditAppointmentPage() {
    const router = useRouter();
    const params = useParams();
    const appointmentId = params.id as string;

    const [types, setTypes] = useState<{ id: string; name: string }[]>([]);
    const [appointment, setAppointment] = useState<any>(null);
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
        notes: "",
        cancellationReason: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentData, typesData] = await Promise.all([
                    appointmentService.getById(appointmentId),
                    appointmentService.getAdminTypes()
                ]);
                setAppointment(appointmentData);
                setTypes(typesData);
                
                // Format the date for input[type="date"]
                const dateObj = new Date(appointmentData.date);
                const formattedDate = dateObj.toISOString().split('T')[0];
                
                // Format the time for input[type="time"]
                const timeStr = appointmentData.time || dateObj.toTimeString().split(' ')[0].substring(0, 5);
                
                setFormData({
                    patientName: appointmentData.patientName,
                    patientEmail: appointmentData.patientEmail,
                    patientPhone: appointmentData.patientPhone,
                    typeId: appointmentData.typeId,
                    date: formattedDate,
                    time: timeStr,
                    duration: appointmentData.duration,
                    status: appointmentData.status,
                    reason: appointmentData.reason,
                    notes: appointmentData.notes || "",
                    cancellationReason: appointmentData.cancellationReason || ""
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [appointmentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        

        
        setIsSubmitting(true);
        try {
            await appointmentService.update(appointmentId, formData);
            toast.success("Appointment updated successfully");
            router.push("/admin/appointments");
        } catch (error) {
            console.error("Failed to update appointment:", error);
            toast.error("Failed to update appointment. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
                    <p className="text-gray-600">Loading appointment...</p>
                </div>
            </div>
        );
    }

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
                                    name="typeId"
                                    value={formData.typeId}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
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
                                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                    Changing status will notify the user via email.
                                </p>
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

                        {/* Cancellation Reason - Only visible when status is CANCELLED */}
                        {formData.status === "CANCELLED" && (
                            <div className="mt-6 animation-fade-in">
                                <label className="block text-sm font-semibold text-red-600 mb-2">
                                    Reason for Cancellation <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="cancellationReason"
                                    value={formData.cancellationReason}
                                    onChange={handleChange} // RichTextEditor uses onChange(value), textarea uses standard event
                                    required={formData.status === "CANCELLED"}
                                    placeholder="Please provide a reason for cancelling this appointment..."
                                    className="w-full px-4 py-3 border border-red-200 rounded-lg focus:border-red-500 focus:outline-none text-gray-900 min-h-[100px] bg-red-50/10"
                                />
                                <p className="text-xs text-red-500 mt-1">This reason will be included in the email notification to the patient.</p>
                            </div>
                        )}
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
                                    Saving...
                                </>
                            ) : (
                                "Update Appointment"
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
