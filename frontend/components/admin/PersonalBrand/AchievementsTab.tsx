"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { PersonalBrand, personalBrandService, CreateAchievementData } from '@/services/personal-brand-service';

interface AchievementsTabProps {
    personalBrand: PersonalBrand;
    onUpdate: () => void;
    isEditMode: boolean;
}

export default function AchievementsTab({ personalBrand, onUpdate, isEditMode }: AchievementsTabProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAchievementData>({
        title: '',
        issuer: '',
        issueDate: ''
    });

    const achievements = personalBrand.achievementAwards || [];

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdding(true);
        try {
            const response = await personalBrandService.createAchievement(formData);
            if (response.status === 'success') {
                toast.success('Achievement added successfully!');
                setFormData({ title: '', issuer: '', issueDate: '' });
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to add achievement');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add achievement');
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdate = async (id: string, data: CreateAchievementData) => {
        try {
            const response = await personalBrandService.updateAchievement(id, data);
            if (response.status === 'success') {
                toast.success('Achievement updated successfully!');
                setEditingId(null);
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to update achievement');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update achievement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this achievement?')) return;
        try {
            const response = await personalBrandService.deleteAchievement(id);
            if (response.status === 'success') {
                toast.success('Achievement deleted successfully!');
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to delete achievement');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete achievement');
        }
    };

    // View Mode - Read-only display
    if (!isEditMode) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Achievements & Awards ({achievements.length})</h3>
                {achievements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No achievements added yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {achievements.map((ach) => (
                            <div key={ach.id} className="px-4 py-3 bg-yellow-50 rounded-full border border-yellow-200 flex items-center gap-3">
                                <div className="text-yellow-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-yellow-900 text-sm">{ach.title}</p>
                                    <p className="text-xs text-yellow-600">{ach.issuer} • {new Date(ach.issueDate).getFullYear()}</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Achievement</h3>
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
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Issuer *</label>
                        <input
                            type="text"
                            value={formData.issuer}
                            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
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
                    {isAdding ? 'Adding...' : 'Add Achievement'}
                </button>
            </form>

            {/* Achievements List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Your Achievements ({achievements.length})</h3>
                {achievements.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No achievements added yet.</p>
                ) : (
                    achievements.map((achievement) => (
                        <AchievementItem
                            key={achievement.id}
                            achievement={achievement}
                            isEditing={editingId === achievement.id}
                            onEdit={() => setEditingId(achievement.id)}
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

function AchievementItem({ achievement, isEditing, onEdit, onCancelEdit, onUpdate, onDelete }: any) {
    const [formData, setFormData] = useState({
        title: achievement.title,
        issuer: achievement.issuer,
        issueDate: achievement.issueDate.split('T')[0]
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
                        value={formData.issuer}
                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
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
                        onClick={() => onUpdate(achievement.id, formData)}
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
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                    🏆
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.issuer}</p>
                    <p className="text-xs text-gray-500">{new Date(achievement.issueDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(achievement.id)}
                    className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
