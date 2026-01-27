"use client";

import { useState, useEffect } from "react";
import { appointmentService, AppointmentType } from "@/services/appointment-service";
import toast from "react-hot-toast";

interface AppointmentTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export default function AppointmentTypeModal({ isOpen, onClose, onUpdate }: AppointmentTypeModalProps) {
    const [types, setTypes] = useState<AppointmentType[]>([]);
    const [newTypeName, setNewTypeName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchTypes();
        }
    }, [isOpen]);

    const fetchTypes = async () => {
        try {
            const data = await appointmentService.getAllTypes();
            setTypes(data);
        } catch (error: any) {
            toast.error(error.message || "Failed to load types");
        }
    };

    const handleAddType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeName.trim()) {
            toast.error("Type name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            await appointmentService.createType(newTypeName.trim());
            toast.success("Type added successfully");
            setNewTypeName("");
            await fetchTypes();
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || "Failed to add type");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteType = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        setIsDeletingId(id);
        try {
            await appointmentService.deleteType(id);
            toast.success("Type deleted successfully");
            await fetchTypes();
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete type");
        } finally {
            setIsDeletingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Manage Appointment Types</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Add Type Form */}
                <form onSubmit={handleAddType} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            placeholder="Enter type name..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>

                {/* Types List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {types.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No appointment types yet</p>
                    ) : (
                        types.map((type) => (
                            <div
                                key={type.id}
                                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-gray-900 font-medium">{type.name}</span>
                                <button
                                    onClick={() => handleDeleteType(type.id, type.name)}
                                    disabled={isDeletingId === type.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isDeletingId === type.id ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
