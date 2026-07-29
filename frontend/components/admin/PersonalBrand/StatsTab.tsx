"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { brandStatsService, BrandStats } from '@/services/brand-stats-service';
import { PersonalBrand, personalBrandService } from '@/services/personal-brand-service';

interface StatsTabProps {
    personalBrand?: PersonalBrand | null;
    onUpdate?: () => void;
    isEditMode: boolean;
}

export default function StatsTab({ personalBrand, onUpdate, isEditMode }: StatsTabProps) {
    const profile = personalBrand?.profile;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [stats, setStats] = useState<BrandStats>(() => {
        const local = brandStatsService.getStats();
        return {
            happyPatients: profile?.happyPatients || local.happyPatients,
            yearsExperience: profile?.yearsExperience || local.yearsExperience,
            resources: profile?.resources || local.resources,
            expertTopics: profile?.expertTopics || local.expertTopics,
            speakingEventsOverride: profile?.speakingEventsOverride || local.speakingEventsOverride || ''
        };
    });

    useEffect(() => {
        if (profile) {
            const updated = {
                happyPatients: profile.happyPatients || stats.happyPatients,
                yearsExperience: profile.yearsExperience || stats.yearsExperience,
                resources: profile.resources || stats.resources,
                expertTopics: profile.expertTopics || stats.expertTopics,
                speakingEventsOverride: profile.speakingEventsOverride || stats.speakingEventsOverride || ''
            };
            setStats(updated);
            brandStatsService.saveStats(updated);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStats({
            ...stats,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Always save to local state / broadcast event
        brandStatsService.saveStats(stats);

        // If backend profile is loaded, attempt backend persistence as well
        if (profile) {
            try {
                await personalBrandService.updateProfile({
                    fullName: profile.fullName || 'Dr. George',
                    professional_title: profile.professional_title || '',
                    tagline: profile.tagline || '',
                    email: profile.email || '',
                    phoneNumber: profile.phoneNumber || '',
                    location: profile.location || '',
                    short_bio: profile.short_bio || '',
                    full_bio: profile.full_bio || '',
                    happyPatients: stats.happyPatients,
                    yearsExperience: stats.yearsExperience,
                    resources: stats.resources,
                    expertTopics: stats.expertTopics,
                    speakingEventsOverride: stats.speakingEventsOverride
                });
                if (onUpdate) onUpdate();
            } catch (err) {
                console.error("Failed to sync backend brand stats", err);
            }
        }

        toast.success('Brand statistics updated successfully!');
        setIsSubmitting(false);
    };

    if (!isEditMode) {
        return (
            <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Hero & Public Website Statistics</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        These metrics are displayed on the Home Page Hero section and the About Page statistics grid.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Happy Patients / Served</p>
                            <p className="text-2xl font-extrabold text-[#0066ff]">{stats.happyPatients}</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Years Experience</p>
                            <p className="text-2xl font-extrabold text-[#0066ff]">{stats.yearsExperience}</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Resources Provided</p>
                            <p className="text-2xl font-extrabold text-[#0066ff]">{stats.resources}</p>
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expert Topics</p>
                            <p className="text-2xl font-extrabold text-[#0066ff]">{stats.expertTopics}</p>
                        </div>
                    </div>

                    {stats.speakingEventsOverride && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Speaking Events Override</p>
                            <p className="text-lg font-bold text-blue-900">{stats.speakingEventsOverride}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Brand Display Statistics</h3>
                    <p className="text-sm text-gray-600">
                        Customize the numbers displayed across your public website (Home Hero bar and About page).
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Happy Patients / Patients Served
                        </label>
                        <input
                            type="text"
                            name="happyPatients"
                            value={stats.happyPatients}
                            onChange={handleChange}
                            placeholder="e.g. 10K+ or 10,000+"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Years of Experience
                        </label>
                        <input
                            type="text"
                            name="yearsExperience"
                            value={stats.yearsExperience}
                            onChange={handleChange}
                            placeholder="e.g. 15+"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Resources Provided
                        </label>
                        <input
                            type="text"
                            name="resources"
                            value={stats.resources}
                            onChange={handleChange}
                            placeholder="e.g. 500+"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Expert Topics Covered
                        </label>
                        <input
                            type="text"
                            name="expertTopics"
                            value={stats.expertTopics}
                            onChange={handleChange}
                            placeholder="e.g. 50+"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 font-semibold"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Speaking Events Custom Override <span className="text-xs font-normal text-gray-500">(Optional: Leave blank to auto-count database events)</span>
                        </label>
                        <input
                            type="text"
                            name="speakingEventsOverride"
                            value={stats.speakingEventsOverride || ''}
                            onChange={handleChange}
                            placeholder="e.g. 500+ (Leave empty to use dynamic database event count)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 font-semibold"
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#00d4aa] text-white font-semibold rounded-lg hover:bg-[#00bfa6] disabled:bg-gray-300 transition-colors shadow-md cursor-pointer"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Statistics'}
                    </button>
                </div>
            </div>
        </form>
    );
}
