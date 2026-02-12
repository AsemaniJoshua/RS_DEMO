"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { appointmentService } from "@/services/appointment-service";
import toast from "react-hot-toast";

export default function BookingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
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
        notes: "",
    });

    // Populate email if authenticated
    useEffect(() => {
        if (isAuthenticated && typeof window !== "undefined") {
            const userRaw = localStorage.getItem("user");
            if (userRaw) {
                try {
                    const parsed = JSON.parse(userRaw);
                    const patientEmail = parsed.email || parsed.patientEmail || "";
                    if (patientEmail) {
                        setFormData((prev) => ({ ...prev, patientEmail }));
                    }
                } catch {
                    // fallback
                }
            }
            if (!formData.patientEmail) {
                const email = localStorage.getItem("user_email") || "";
                if (email) {
                    setFormData((prev) => ({ ...prev, patientEmail: email }));
                }
            }
        }
    }, [isAuthenticated]);

    // Fetch appointment types
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await appointmentService.getPublicTypes();
                setTypes(data);
                if (data.length > 0) {
                    setFormData((prev) => ({ ...prev, typeId: data[0].id }));
                }
            } catch (error) {
                toast.error("Failed to fetch appointment types");
            } finally {
                setLoading(false);
            }
        };
        fetchTypes();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!isAuthenticated) {
            // Store form data in sessionStorage to restore after login
            sessionStorage.setItem("pendingAppointment", JSON.stringify(formData));
            toast.error("Please login to book an appointment");
            router.push("/login?redirect=/booking");
            return;
        }

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
            // Get userId from localStorage
            let userId = "";
            let patientEmail = formData.patientEmail;
            if (typeof window !== "undefined") {
                const userRaw = localStorage.getItem("user");
                if (userRaw) {
                    try {
                        const parsed = JSON.parse(userRaw);
                        userId = parsed.id || parsed.userId || "";
                        if (!patientEmail) patientEmail = parsed.email || parsed.patientEmail || "";
                    } catch {
                        userId = userRaw;
                    }
                }
                if (!patientEmail) {
                    patientEmail = localStorage.getItem("user_email") || "";
                }
            }

            const payload = {
                patientName: formData.patientName,
                patientEmail,
                patientPhone: formData.patientPhone,
                typeId: formData.typeId,
                date: formData.date,
                time: formData.time,
                duration: formData.duration,
                reason: formData.reason,
                notes: formData.notes,
                userId,
            };

            const created = await appointmentService.createMyAppointment(payload);
            if (created && created.id) {
                toast.success("Appointment booked successfully");
                // Clear session storage
                sessionStorage.removeItem("pendingAppointment");
                // Redirect to dashboard appointments
                router.push(`/dashboard/appointments/${created.id}`);
            } else {
                toast.error("Appointment creation failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to book appointment");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Restore form data from sessionStorage if available
    useEffect(() => {
        if (isAuthenticated && typeof window !== "undefined") {
            const pendingData = sessionStorage.getItem("pendingAppointment");
            if (pendingData) {
                try {
                    const parsed = JSON.parse(pendingData);
                    setFormData((prev) => ({ ...prev, ...parsed }));
                    toast.success("Your booking details have been restored. Please review and submit.");
                } catch {
                    // ignore
                }
            }
        }
    }, [isAuthenticated]);

    // Service icons for display
    const serviceIcons = {
        "General Consultation": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        "Virtual Medication Review": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        "Diabetes & Weight Loss Consultation": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        "Health & Wellness Strategy Session": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span className="text-sm font-medium">Book Appointment</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Schedule Your{" "}
                            <span className="text-[#0066ff]">Consultation</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Book your personalized health consultation with Dr. George. Fill in your details below to get started.
                        </p>
                    </div>
                </div>
            </section>

            {/* Booking Form Section */}
            <section className="py-12 lg:py-16 bg-gray-50">
                <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Information Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Information</h2>
                            
                            <div className="space-y-4">
                                <div>
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="patientEmail"
                                            value={formData.patientEmail}
                                            onChange={handleChange}
                                            disabled={isAuthenticated}
                                            required
                                            placeholder="patient@email.com"
                                            className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 ${
                                                isAuthenticated ? "bg-gray-100 cursor-not-allowed" : ""
                                            }`}
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment Details</h2>
                            
                            <div className="space-y-4">
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                    >
                                        {types.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid sm:grid-cols-3 gap-4">
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
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
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
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
                                            placeholder="e.g., 30 min"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Reason for Appointment <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Discuss new diabetes medication"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none text-gray-900"
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
                                        rows={4}
                                        placeholder="Any specific concerns or topics you'd like to discuss..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#0066ff] focus:outline-none resize-none text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="w-full sm:w-auto px-8 py-4 bg-[#0066ff] text-white rounded-full hover:bg-[#0052cc] transition-colors font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        {isAuthenticated ? "Book Appointment" : "Continue to Login"}
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                            
                            {!isAuthenticated && (
                                <p className="text-sm text-gray-600 text-center sm:text-left">
                                    You'll be redirected to login to complete your booking
                                </p>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#0066ff] flex-shrink-0">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <div className="text-sm text-gray-700">
                                <p className="font-semibold mb-1">What happens next?</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>You'll receive a confirmation email after booking</li>
                                    <li>Dr. George's team will review and confirm your appointment</li>
                                    <li>You can manage your appointments from your dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
