"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { appointmentService, Appointment } from "@/services/appointment-service";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getMyAppointments();
            setAppointments(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-50 text-green-700";
            case "COMPLETED":
                return "bg-blue-50 text-blue-700";
            case "CANCELLED":
                return "bg-red-50 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Split appointments into upcoming and past
    const now = new Date();
    const upcomingAppointments = appointments.filter(a => new Date(a.date) >= now);
    const pastAppointments = appointments.filter(a => new Date(a.date) < now);
    const displayedAppointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">Manage your consultations and appointments</p>
                </div>
                <Link href="/dashboard/appointments/new">
                    <button className="w-full sm:w-auto px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium flex items-center justify-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Book New Appointment
                    </button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</div>
                    <div className="text-sm text-gray-600">Upcoming Appointments</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{pastAppointments.length}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "upcoming"
                                ? "text-[#0066ff] border-b-2 border-[#0066ff]"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Upcoming ({upcomingAppointments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === "past"
                                ? "text-[#0066ff] border-b-2 border-[#0066ff]"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Past ({pastAppointments.length})
                    </button>
                </div>

                {/* Appointments List */}
                <div className="p-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading appointments...</p>
                        </div>
                    ) : displayedAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No {activeTab} appointments
                            </h3>
                            <p className="text-gray-600">
                                {activeTab === "upcoming" 
                                    ? "Book your first appointment to get started" 
                                    : "Your completed appointments will appear here"}
                            </p>
                        </div>
                    ) : (
                        displayedAppointments.map((appointment) => (
                            <div key={appointment.id} className="border border-gray-200 rounded-lg p-5 hover:border-[#0066ff] transition-colors cursor-pointer"
                                onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#0066ff] to-[#0052cc] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{appointment.type?.name}</h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                    {formatDate(appointment.date)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                    {appointment.time}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {appointment.notes && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <span className="font-medium">Note:</span> {appointment.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
