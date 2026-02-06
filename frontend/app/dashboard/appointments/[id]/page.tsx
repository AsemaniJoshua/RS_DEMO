"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { appointmentService, Appointment } from "@/services/appointment-service";
import BackButton from "@/components/ui/BackButton";
import toast from "react-hot-toast";

export default function AppointmentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getMyAppointmentById(id as string);
            setAppointment(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to load appointment");
            router.push("/dashboard/appointments");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading appointment details...</p>
                </div>
            </div>
        );
    }

    if (!appointment) return null;

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <BackButton href="/dashboard/appointments" label="Back to Appointments" />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Details</h1>
                <div className="mb-4">
                    <span className="font-semibold">Type:</span> {appointment.type?.name}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Date:</span> {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Time:</span> {appointment.time}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Status:</span> {appointment.status}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Duration:</span> {appointment.duration}
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Reason:</span> {appointment.reason}
                </div>
                {appointment.notes && (
                    <div className="mb-4">
                        <span className="font-semibold">Notes:</span> {appointment.notes}
                    </div>
                )}
            </div>
        </div>
    );
}
