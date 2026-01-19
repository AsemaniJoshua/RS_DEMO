"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { personalBrandService, PersonalBrand } from '@/services/personal-brand-service';
import ProfileTab from '@/components/admin/PersonalBrand/ProfileTab';
import CredentialsTab from '@/components/admin/PersonalBrand/CredentialsTab';
import ExpertiseTab from '@/components/admin/PersonalBrand/ExpertiseTab';
import AchievementsTab from '@/components/admin/PersonalBrand/AchievementsTab';
import SocialMediaTab from '@/components/admin/PersonalBrand/SocialMediaTab';

type Tab = 'profile' | 'credentials' | 'expertise' | 'achievements' | 'social';

export default function PersonalBrandPage() {
    const [personalBrand, setPersonalBrand] = useState<PersonalBrand | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        initializePersonalBrand();
    }, []);

    const initializePersonalBrand = async () => {
        setIsLoading(true);
        try {
            // Try to fetch existing personal brand
            const response = await personalBrandService.getPersonalBrand();
            if (response.status === 'success' && response.data) {
                setPersonalBrand(response.data);
            } else {
                // If no personal brand exists, create one silently
                const createResponse = await personalBrandService.createPersonalBrand();
                if (createResponse.status === 'success') {
                    // Fetch the newly created brand with all relations
                    const fetchResponse = await personalBrandService.getPersonalBrand();
                    if (fetchResponse.status === 'success') {
                        setPersonalBrand(fetchResponse.data || null);
                    }
                }
            }
        } catch (error: any) {
            // If error is "already exists", just fetch it
            if (error.message?.includes('already exists')) {
                const response = await personalBrandService.getPersonalBrand();
                if (response.status === 'success') {
                    setPersonalBrand(response.data || null);
                }
            } else {
                console.error('Error initializing personal brand:', error);
                toast.error('Failed to load personal brand');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPersonalBrand = async () => {
        try {
            const response = await personalBrandService.getPersonalBrand();
            if (response.status === 'success') {
                setPersonalBrand(response.data || null);
            }
        } catch (error) {
            console.error('Error fetching personal brand:', error);
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        // Optionally refetch to reset any unsaved changes
        fetchPersonalBrand();
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading personal brand...</p>
                </div>
            </div>
        );
    }

    // If still no personal brand after initialization, show error
    if (!personalBrand) {
        return (
            <div className="p-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-50 rounded-xl p-12 border border-red-100">
                        <p className="text-red-600 font-medium">Failed to initialize personal brand. Please refresh the page.</p>
                    </div>
                </div>
            </div>
        );
    }


    const tabs = [
        { 
            id: 'profile' as Tab, 
            label: 'Profile', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            id: 'credentials' as Tab, 
            label: 'Credentials', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 12v5c0 1 2 2 6 2s6-1 6-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            id: 'expertise' as Tab, 
            label: 'Expertise', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )
        },
        { 
            id: 'achievements' as Tab, 
            label: 'Achievements', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                    <path d="M12 15l-4 6h8l-4-6zM12 15a6 6 0 100-12 6 6 0 000 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            id: 'social' as Tab, 
            label: 'Social Media', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2"/>
                </svg>
            )
        }
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Brand</h1>
                    <p className="text-gray-600">
                        {isEditMode 
                            ? 'Edit your professional profile and update your information' 
                            : 'View and manage your professional profile'}
                    </p>
                </div>
                <div className="flex gap-3">
                    {isEditMode ? (
                        <button
                            onClick={handleCancelEdit}
                            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-200"
                        >
                            Cancel Editing
                        </button>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium flex items-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit Brand
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[150px] px-6 py-4 font-medium transition-colors relative ${
                                    activeTab === tab.id
                                        ? 'text-[#00d4aa] bg-[#00d4aa]/5'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4aa]"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <ProfileTab
                            personalBrand={personalBrand}
                            onUpdate={fetchPersonalBrand}
                            isEditMode={isEditMode}
                        />
                    )}
                    {activeTab === 'credentials' && (
                        <CredentialsTab
                            personalBrand={personalBrand}
                            onUpdate={fetchPersonalBrand}
                            isEditMode={isEditMode}
                        />
                    )}
                    {activeTab === 'expertise' && (
                        <ExpertiseTab
                            personalBrand={personalBrand}
                            onUpdate={fetchPersonalBrand}
                            isEditMode={isEditMode}
                        />
                    )}
                    {activeTab === 'achievements' && (
                        <AchievementsTab
                            personalBrand={personalBrand}
                            onUpdate={fetchPersonalBrand}
                            isEditMode={isEditMode}
                        />
                    )}
                    {activeTab === 'social' && (
                        <SocialMediaTab
                            personalBrand={personalBrand}
                            onUpdate={fetchPersonalBrand}
                            isEditMode={isEditMode}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
