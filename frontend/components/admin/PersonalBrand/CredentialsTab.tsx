"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { PersonalBrand, personalBrandService, CreateCredentialData } from '@/services/personal-brand-service';

interface CredentialsTabProps {
    personalBrand: PersonalBrand;
    onUpdate: () => void;
    isEditMode: boolean;
}

export default function CredentialsTab({ personalBrand, onUpdate, isEditMode }: CredentialsTabProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateCredentialData>({
        title: '',
        institution: '',
        issueDate: ''
    });

    const credentials = personalBrand.credentialCertifications || [];

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const response = await personalBrandService.createCredential(formData);
            if (response.status === 'success') {
                toast.success('Credential added successfully!');
                setFormData({ title: '', institution: '', issueDate: '' });
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to add credential');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add credential');
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdate = async (id: string, data: CreateCredentialData) => {
        try {
            const response = await personalBrandService.updateCredential(id, data);
            if (response.status === 'success') {
                toast.success('Credential updated successfully!');
                setEditingId(null);
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to update credential');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update credential');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this credential?')) return;
        try {
            const response = await personalBrandService.deleteCredential(id);
            if (response.status === 'success') {
                toast.success('Credential deleted successfully!');
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to delete credential');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete credential');
        }
    };

    // View Mode - Read-only display
    if (!isEditMode) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Credentials & Certifications ({credentials.length})</h3>
                {credentials.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No credentials added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {credentials.map((cred) => (
                            <div key={cred.id} className="px-4 py-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-blue-900">{cred.title}</p>
                                    <p className="text-sm text-blue-600 mt-1">{cred.institution}</p>
                                </div>
                                <div className="text-sm text-blue-500 font-medium">
                                    {new Date(cred.issueDate).getFullYear()}
                                </div>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Credential</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Institution *</label>
                        <input
                            type="text"
                            value={formData.institution}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Issue Date *</label>
                        <input
                            type="date"
                            value={formData.issueDate}
                            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isAdding}
                    className="px-6 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:opacity-50"
                >
                    {isAdding ? 'Adding...' : 'Add Credential'}
                </button>
            </form>

            {/* Credentials List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Your Credentials ({credentials.length})</h3>
                {credentials.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No credentials added yet.</p>
                ) : (
                    credentials.map((cred) => (
                        <CredentialItem
                            key={cred.id}
                            credential={cred}
                            isEditing={editingId === cred.id}
                            onEdit={() => setEditingId(cred.id)}
                            onCancelEdit={() => setEditingId(null)}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function CredentialItem({ credential, isEditing, onEdit, onCancelEdit, onUpdate, onDelete }: any) {
    const [formData, setFormData] = useState({
        title: credential.title,
        institution: credential.institution,
        issueDate: credential.issueDate.split('T')[0]
    });

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-3 gap-4 mb-3">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900"
                    />
                    <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900"
                    />
                    <input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onUpdate(credential.id, formData)}
                        className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] text-sm"
                    >
                        Save
                    </button>
                    <button
                        onClick={onCancelEdit}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
            <div>
                <h4 className="font-semibold text-gray-900">{credential.title}</h4>
                <p className="text-sm text-gray-600">{credential.institution}</p>
                <p className="text-xs text-gray-500">{new Date(credential.issueDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(credential.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
