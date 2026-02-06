"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { appointmentService, Appointment } from "@/services/appointment-service";
import toast from "react-hot-toast";
import DeleteAppointmentModal from "@/components/admin/DeleteAppointmentModal";
import { 
    Calendar, 
    Clock, 
    User, 
    Mail, 
    Phone, 
    FileText, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    ArrowLeft,
    Edit2,
    Trash2
} from "lucide-react";

export default function ViewAppointmentPage() {
    const params = useParams();
    const router = useRouter();
    const appointmentId = params.id as string;
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const data = await appointmentService.getById(appointmentId);
                setAppointment(data);
            } catch (error) {
                console.error("Failed to fetch appointment:", error);
                toast.error("Failed to load appointment details");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, [appointmentId]);

    const handleDelete = async () => {
        if (!appointment) return;
        setIsDeleting(true);
        try {
            await appointmentService.delete(appointment.id);
            toast.success("Appointment cancelled successfully");
            router.push("/admin/appointments");
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel appointment");
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Not Found</h2>
                    <p className="text-gray-500 mb-6">The appointment you're looking for doesn't exist or has been removed.</p>
                    <Link href="/admin/appointments">
                        <button className="px-6 py-2.5 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium">
                            Back to Appointments
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-100';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
            case 'SCHEDULED': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
            case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/appointments"
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointment Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>ID: {appointment.id.slice(0, 8)}...</span>
                            <span>•</span>
                            <span>Created {new Date(appointment.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/admin/appointments/${appointmentId}/edit`}>
                        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 shadow-sm">
                            <Edit2 className="w-4 h-4" />
                            Edit Details
                        </button>
                    </Link>
                    <button 
                        onClick={() => setDeleteModalOpen(true)}
                        className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Cancel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status & Time Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Session Information</h3>
                                <p className="text-sm text-gray-500">Date and timing details</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(appointment.status)}`}>
                                {getStatusIcon(appointment.status)}
                                {appointment.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Date</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {new Date(appointment.date).toLocaleDateString(undefined, { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Time & Duration</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {appointment.time}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-0.5">
                                        {appointment.duration}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Context & Notes */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Clinical Context</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Reason for Visit</h4>
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-900 font-medium border border-gray-100">
                                    {appointment.reason}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Additional Notes</h4>
                                {appointment.notes ? (
                                    <div 
                                        className="prose prose-sm prose-blue max-w-none p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: appointment.notes }}
                                    />
                                ) : (
                                    <div className="text-gray-400 italic flex items-center gap-2 p-4 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                                        <AlertCircle className="w-4 h-4" />
                                        No additional notes provided
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Patient Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Patient Details</h3>
                            <span className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                <User className="w-5 h-5" />
                            </span>
                        </div>

                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/20">
                                {appointment.patientName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{appointment.patientName}</h2>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                {appointment.type?.name || 'Standard Visit'}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-xs text-gray-500 font-medium mb-0.5">Email Address</div>
                                    <div className="text-sm font-semibold text-gray-900 truncate" title={appointment.patientEmail}>
                                        {appointment.patientEmail}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 font-medium mb-0.5">Phone Number</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {appointment.patientPhone}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <DeleteAppointmentModal
                isOpen={deleteModalOpen}
                onCancel={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                appointmentName={appointment.patientName}
                isDeleting={isDeleting}
            />
        </div>
    );
}
