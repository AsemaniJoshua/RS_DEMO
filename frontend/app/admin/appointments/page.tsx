"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { appointmentService, Appointment, AppointmentType } from "@/services/appointment-service";
import DeleteAppointmentModal from "@/components/admin/DeleteAppointmentModal";
import AppointmentTypeModal from "@/components/admin/AppointmentTypeModal";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [types, setTypes] = useState<AppointmentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null; name: string }>({
        show: false,
        id: null,
        name: ""
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [typeModal, setTypeModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [appointmentsData, typesData] = await Promise.all([
                appointmentService.getAllAppointments(),
                appointmentService.getAdminTypes()
            ]);
            setAppointments(appointmentsData);
            setTypes(typesData);
        } catch (error: any) {
            toast.error(error.message || "Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            appointment.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "All Types" || appointment.typeId === typeFilter;
        const matchesStatus = statusFilter === "All Statuses" || appointment.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: appointments.length,
        scheduled: appointments.filter(a => a.status === "SCHEDULED").length,
        confirmed: appointments.filter(a => a.status === "CONFIRMED").length,
        completed: appointments.filter(a => a.status === "COMPLETED").length
    };

    const handleDeleteClick = (id: string, name: string) => {
        setDeleteModal({ show: true, id, name });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.id) return;
        
        setIsDeleting(true);
        try {
            await appointmentService.deleteAppointment(deleteModal.id);
            toast.success("Appointment deleted successfully");
            setDeleteModal({ show: false, id: null, name: "" });
            fetchData();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete appointment");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        if (!isDeleting) {
            setDeleteModal({ show: false, id: null, name: "" });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-blue-50 text-blue-700";
            case "CONFIRMED":
                return "bg-green-50 text-green-700";
            case "COMPLETED":
                return "bg-purple-50 text-purple-700";
            case "CANCELLED":
                return "bg-red-50 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
                    <p className="text-gray-600">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage patient appointments and schedules</p>
                </div>
                <Link href="/admin/appointments/new">
                    <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                        + Schedule Appointment
                    </button>
                </Link>
            </div>

            <div className="flex justify-end mb-6">
                 <button 
                    onClick={() => setTypeModal(true)}
                    className="text-sm text-[#00d4aa] hover:text-[#00bfa6] font-medium flex items-center gap-1 cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Manage Types
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Appointments</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.scheduled}</div>
                            <div className="text-sm text-gray-600">Scheduled</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.confirmed}</div>
                            <div className="text-sm text-gray-600">Confirmed</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                                <polyline points="9 11 12 14 22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                            <div className="text-sm text-gray-600">Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by patient name, email, or reason..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        >
                            <option value="All Types">All Types</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>

                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All Statuses">All Statuses</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Appointments Table */}
            {!isLoading && filteredAppointments.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                </div>
            )}

            {filteredAppointments.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[768px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Patient</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((appointment, idx) => (
                                    <tr key={appointment.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{appointment.patientName}</div>

                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                {appointment.type.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-600">{appointment.time}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{appointment.duration}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{appointment.patientPhone}</div>
                                            <div className="text-sm text-gray-600">{appointment.patientEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/appointments/${appointment.id}`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="View Details">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <Link href={`/admin/appointments/${appointment.id}/edit`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(appointment.id, appointment.patientName)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <DeleteAppointmentModal
                isOpen={deleteModal.show}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                appointmentName={deleteModal.name}
                isDeleting={isDeleting}
            />

            {/* Type Management Modal */}
            <AppointmentTypeModal
                isOpen={typeModal}
                onClose={() => setTypeModal(false)}
                onUpdate={fetchData}
            />
        </div>
    );
}
