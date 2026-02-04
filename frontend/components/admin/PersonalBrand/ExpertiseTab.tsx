"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { PersonalBrand, personalBrandService, CreateExpertiseData } from '@/services/personal-brand-service';

interface ExpertiseTabProps {
    personalBrand: PersonalBrand;
    onUpdate: () => void;
    isEditMode: boolean;
}

export default function ExpertiseTab({ personalBrand, onUpdate, isEditMode }: ExpertiseTabProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newExpertise, setNewExpertise] = useState('');

    const expertiseList = personalBrand.areasOfExpertise || [];

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExpertise.trim()) return;

        setIsAdding(true);
        try {
            const response = await personalBrandService.createExpertise({ name: newExpertise });
            if (response.status === 'success') {
                toast.success('Expertise added successfully!');
                setNewExpertise('');
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to add expertise');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add expertise');
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdate = async (id: string, name: string) => {
        try {
            const response = await personalBrandService.updateExpertise(id, { name });
            if (response.status === 'success') {
                toast.success('Expertise updated successfully!');
                setEditingId(null);
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to update expertise');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update expertise');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expertise?')) return;
        try {
            const response = await personalBrandService.deleteExpertise(id);
            if (response.status === 'success') {
                toast.success('Expertise deleted successfully!');
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to delete expertise');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete expertise');
        }
    };

    const expertise = personalBrand.areasOfExpertise || [];

    // View Mode - Read-only display
    if (!isEditMode) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Areas of Expertise ({expertise.length})</h3>
                {expertise.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No expertise areas added yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {expertise.map((item) => (
                            <div key={item.id} className="px-4 py-2 bg-[#00d4aa]/10 text-[#00d4aa] rounded-full border border-[#00d4aa]/20">
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Edit Mode - Editable view
    return (
        <div className="space-y-6">
            {/* Add New Form */}
            <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Area of Expertise</h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newExpertise}
                        onChange={(e) => setNewExpertise(e.target.value)}
                        placeholder="e.g., Mental Health, Cardiology, Surgery..."
                        required
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:opacity-50"
                    >
                        {isAdding ? 'Adding...' : 'Add Expertise'}
                    </button>
                </div>
            </form>

            {/* Expertise List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Your Areas of Expertise ({expertiseList.length})</h3>
                {expertiseList.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No expertise areas added yet.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {expertiseList.map((exp) => (
                            <ExpertiseItem
                                key={exp.id}
                                expertise={exp}
                                isEditing={editingId === exp.id}
                                onEdit={() => setEditingId(exp.id)}
                                onCancelEdit={() => setEditingId(null)}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ExpertiseItem({ expertise, isEditing, onEdit, onCancelEdit, onUpdate, onDelete }: any) {
    const [name, setName] = useState(expertise.name);
    const [isSaving, setIsSaving] = useState(false);
    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-3 text-gray-900"
                />
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            setIsSaving(true);
                            await onUpdate(expertise.id, name);
                            setIsSaving(false);
                        }}
                        className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] text-sm"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <span className="font-medium text-gray-900">💡 {expertise.name}</span>
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(expertise.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
