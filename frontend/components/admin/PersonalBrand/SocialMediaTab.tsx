"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { PersonalBrand, personalBrandService, UpdateSocialMediaData } from '@/services/personal-brand-service';

interface SocialMediaTabProps {
    personalBrand: PersonalBrand;
    onUpdate: () => void;
    isEditMode: boolean;
}

export default function SocialMediaTab({ personalBrand, onUpdate, isEditMode }: SocialMediaTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<UpdateSocialMediaData>({
        linkedin: personalBrand.socialMedia?.linkedin || '',
        twitter: personalBrand.socialMedia?.twitter || '',
        facebook: personalBrand.socialMedia?.facebook || '',
        instagram: personalBrand.socialMedia?.instagram || '',
        youtube: personalBrand.socialMedia?.youtube || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await personalBrandService.updateSocialMedia(formData);
            if (response.status === 'success') {
                toast.success('Social media links updated successfully!');
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to update social media');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update social media');
        } finally {
            setIsSubmitting(false);
        }
    };

    const socialMedia = personalBrand.socialMedia;

    // View Mode - Read-only display
    if (!isEditMode) {
        const platformStyles: Record<string, string> = {
            'LinkedIn': 'px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-medium',
            'Twitter': 'px-4 py-2 bg-sky-50 text-sky-700 rounded-full border border-sky-200 hover:bg-sky-100 transition-colors flex items-center gap-2 text-sm font-medium',
            'Facebook': 'px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-2 text-sm font-medium',
            'Instagram': 'px-4 py-2 bg-pink-50 text-pink-700 rounded-full border border-pink-200 hover:bg-pink-100 transition-colors flex items-center gap-2 text-sm font-medium',
            'YouTube': 'px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2 text-sm font-medium',
        };

        const platforms = [
            { label: 'LinkedIn', value: socialMedia?.linkedin },
            { label: 'Twitter', value: socialMedia?.twitter },
            { label: 'Facebook', value: socialMedia?.facebook },
            { label: 'Instagram', value: socialMedia?.instagram },
            { label: 'YouTube', value: socialMedia?.youtube },
        ];

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
                <div className="flex flex-wrap gap-3">
                    {platforms
                        .filter(platform => platform.value)
                        .map((platform) => (
                            <a 
                                key={platform.label} 
                                href={platform.value} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={platformStyles[platform.label]}
                            >
                                <span>{platform.label}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                    <polyline points="15 3 21 3 21 9"/>
                                    <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                            </a>
                        ))}
                    {platforms.filter(p => p.value).length === 0 && (
                        <p className="text-gray-500 text-center py-8 w-full">No social media links added yet.</p>
                    )}
                </div>
            </div>
        );
    }

    // Edit Mode - Editable view
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <p className="text-sm text-blue-800">
                    💡 Add your social media profile links to help people connect with you across platforms.
                </p>
            </div>

            <div className="space-y-4">
                {/* LinkedIn */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            LinkedIn
                        </span>
                    </label>
                    <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>

                {/* Twitter */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            Twitter / X
                        </span>
                    </label>
                    <input
                        type="url"
                        value={formData.twitter}
                        onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>

                {/* Facebook */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Facebook
                        </span>
                    </label>
                    <input
                        type="url"
                        value={formData.facebook}
                        onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>

                {/* Instagram */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            Instagram
                        </span>
                    </label>
                    <input
                        type="url"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>

                {/* YouTube */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            YouTube
                        </span>
                    </label>
                    <input
                        type="url"
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                        </>
                    ) : (
                        'Update Social Media'
                    )}
                </button>
            </div>
        </form>
    );
}
