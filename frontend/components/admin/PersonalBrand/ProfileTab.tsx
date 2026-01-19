"use client";

import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { PersonalBrand, personalBrandService, UpdateProfileData } from '@/services/personal-brand-service';

interface ProfileTabProps {
    personalBrand: PersonalBrand;
    onUpdate: () => void;
    isEditMode: boolean;
}

export default function ProfileTab({ personalBrand, onUpdate, isEditMode }: ProfileTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(
        personalBrand.profile?.profile_image_url || null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<UpdateProfileData>({
        fullName: personalBrand.profile?.fullName || '',
        professional_title: personalBrand.profile?.professional_title || '',
        tagline: personalBrand.profile?.tagline || '',
        email: personalBrand.profile?.email || '',
        phoneNumber: personalBrand.profile?.phoneNumber || '',
        location: personalBrand.profile?.location || '',
        short_bio: personalBrand.profile?.short_bio || '',
        full_bio: personalBrand.profile?.full_bio || ''
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await personalBrandService.updateProfile(formData, imageFile || undefined);
            if (response.status === 'success') {
                toast.success('Profile updated successfully!');
                onUpdate();
            } else {
                toast.error(response.message || 'Failed to update profile');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    // View Mode - Read-only display
    if (!isEditMode) {
        const profile = personalBrand.profile;
        return (
            <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
                        {profile?.profile_image_url ? (
                            <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{profile?.fullName || 'Not set'}</h2>
                        {profile?.professional_title && (
                            <p className="text-lg text-[#00d4aa] mt-1">{profile.professional_title}</p>
                        )}
                        {profile?.tagline && (
                            <p className="text-gray-600 mt-2 italic">"{profile.tagline}"</p>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InfoItem label="Email" value={profile?.email} />
                        <InfoItem label="Phone" value={profile?.phoneNumber} />
                        <InfoItem label="Location" value={profile?.location} className="col-span-2" />
                    </div>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Short Bio</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{profile?.short_bio || 'Not set'}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Full Bio</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{profile?.full_bio || 'Not set'}</p>
                </div>
            </div>
        );
    }

    // Edit Mode - Editable form
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Profile Image</label>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="profile-image"
                        />
                        <label
                            htmlFor="profile-image"
                            className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-block"
                        >
                            Choose Image
                        </label>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Professional Title</label>
                    <input
                        type="text"
                        value={formData.professional_title}
                        onChange={(e) => setFormData({ ...formData, professional_title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tagline *</label>
                    <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Short Bio *</label>
                    <textarea
                        value={formData.short_bio}
                        onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Bio *</label>
                    <textarea
                        value={formData.full_bio}
                        onChange={(e) => setFormData({ ...formData, full_bio: e.target.value })}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
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
                        'Update Profile'
                    )}
                </button>
            </div>
        </form>
    );
}

// Helper component for displaying info items in view mode
function InfoItem({ label, value, className = '' }: { label: string; value?: string; className?: string }) {
    return (
        <div className={className}>
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-gray-900">{value || 'Not set'}</p>
        </div>
    );
}
