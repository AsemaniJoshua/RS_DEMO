"use client";

import { useState } from "react";
import Image from "next/image";
import brandData from "@/data/admin/brand.json";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function PersonalBrandPage() {
    const [activeTab, setActiveTab] = useState<"profile" | "credentials" | "social">("profile");
    const [isEditing, setIsEditing] = useState(false);
    
    const [profileData, setProfileData] = useState({
        name: brandData.profile.name,
        title: brandData.profile.title,
        tagline: brandData.profile.tagline,
        email: brandData.profile.email,
        phone: brandData.profile.phone,
        location: brandData.profile.location,
        website: brandData.profile.website,
        shortBio: brandData.bio.short,
        fullBio: brandData.bio.full
    });

    const [credentials, setCredentials] = useState(brandData.credentials);
    const [expertise, setExpertise] = useState(brandData.expertise);
    const [achievements, setAchievements] = useState(brandData.achievements);
    
    const [socialMedia, setSocialMedia] = useState(brandData.socialMedia);

    const handleSave = () => {
        console.log("Saving brand data:", { profileData, credentials, expertise, achievements, socialMedia });
        setIsEditing(false);
    };

    const handleAddCredential = () => {
        const newCredential = {
            id: credentials.length + 1,
            title: "",
            institution: "",
            year: new Date().getFullYear().toString()
        };
        setCredentials([...credentials, newCredential]);
    };

    const handleRemoveCredential = (id: number) => {
        setCredentials(credentials.filter(c => c.id !== id));
    };

    const handleAddAchievement = () => {
        const newAchievement = {
            id: achievements.length + 1,
            title: "",
            organization: "",
            year: new Date().getFullYear().toString()
        };
        setAchievements([...achievements, newAchievement]);
    };

    const handleRemoveAchievement = (id: number) => {
        setAchievements(achievements.filter(a => a.id !== id));
    };

    const handleAddExpertise = () => {
        setExpertise([...expertise, ""]);
    };

    const handleRemoveExpertise = (index: number) => {
        setExpertise(expertise.filter((_, i) => i !== index));
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Personal Brand</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage your professional profile and presence</p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="text-3xl font-bold text-[#00d4aa] mb-1">{brandData.statistics.yearsExperience}+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="text-3xl font-bold text-[#00d4aa] mb-1">{brandData.statistics.patientsServed.toLocaleString()}+</div>
                    <div className="text-sm text-gray-600">Patients Served</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="text-3xl font-bold text-[#00d4aa] mb-1">{brandData.statistics.publicationsCount}</div>
                    <div className="text-sm text-gray-600">Publications</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="text-3xl font-bold text-[#00d4aa] mb-1">{brandData.statistics.speakingEngagements}+</div>
                    <div className="text-sm text-gray-600">Speaking Events</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                        activeTab === "profile"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Profile & Bio
                </button>
                <button
                    onClick={() => setActiveTab("credentials")}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                        activeTab === "credentials"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Credentials & Expertise
                </button>
                <button
                    onClick={() => setActiveTab("social")}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                        activeTab === "social"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Social Media
                </button>
                </div>
            </div>

            {/* Profile & Bio Tab */}
            {activeTab === "profile" && (
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
                        
                        {/* Profile Photo */}
                        <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#00d4aa]/20">
                                <Image 
                                    src={brandData.profile.photo} 
                                    alt={brandData.profile.name}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            {isEditing && (
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Profile Photo
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#00d4aa] transition-colors cursor-pointer">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 text-gray-400">
                                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <p className="text-sm text-gray-600">Click to upload new photo</p>
                                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Professional Title</label>
                                <input
                                    type="text"
                                    value={profileData.title}
                                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Tagline</label>
                                <input
                                    type="text"
                                    value={profileData.tagline}
                                    onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={profileData.location}
                                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Website</label>
                                <input
                                    type="url"
                                    value={profileData.website}
                                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Biography</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Short Bio (1-2 sentences)</label>
                                {isEditing ? (
                                    <textarea
                                        value={profileData.shortBio}
                                        onChange={(e) => setProfileData({ ...profileData, shortBio: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 resize-none"
                                    />
                                ) : (
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{profileData.shortBio}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Bio</label>
                                {isEditing ? (
                                    <RichTextEditor
                                        value={profileData.fullBio}
                                        onChange={(value) => setProfileData({ ...profileData, fullBio: value })}
                                        placeholder="Write your full professional biography..."
                                        minHeight="250px"
                                    />
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">{profileData.fullBio}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Credentials & Expertise Tab */}
            {activeTab === "credentials" && (
                <div className="space-y-6">
                    {/* Credentials */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Credentials & Certifications</h2>
                            {isEditing && (
                                <button
                                    onClick={handleAddCredential}
                                    className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors text-sm font-medium"
                                >
                                    + Add Credential
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {credentials.map((cred, index) => (
                                <div key={cred.id} className="border border-gray-200 rounded-lg p-4">
                                    {isEditing ? (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Credential Title"
                                                    value={cred.title}
                                                    onChange={(e) => {
                                                        const newCreds = [...credentials];
                                                        newCreds[index].title = e.target.value;
                                                        setCredentials(newCreds);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Institution"
                                                    value={cred.institution}
                                                    onChange={(e) => {
                                                        const newCreds = [...credentials];
                                                        newCreds[index].institution = e.target.value;
                                                        setCredentials(newCreds);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Year"
                                                    value={cred.year}
                                                    onChange={(e) => {
                                                        const newCreds = [...credentials];
                                                        newCreds[index].year = e.target.value;
                                                        setCredentials(newCreds);
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                                />
                                                <button
                                                    onClick={() => handleRemoveCredential(cred.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                                                    <path d="M12 15l-2 5-2-5-5-2 5-2 2-5 2 5 5 2-5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{cred.title}</div>
                                                <div className="text-sm text-gray-600">{cred.institution}</div>
                                                <div className="text-sm text-gray-500 mt-1">{cred.year}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expertise */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Areas of Expertise</h2>
                            {isEditing && (
                                <button
                                    onClick={handleAddExpertise}
                                    className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors text-sm font-medium"
                                >
                                    + Add Expertise
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {expertise.map((skill, index) => (
                                <div key={index} className="relative">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-[#00d4aa]/10 text-[#00d4aa] rounded-full">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => {
                                                    const newExpertise = [...expertise];
                                                    newExpertise[index] = e.target.value;
                                                    setExpertise(newExpertise);
                                                }}
                                                className="bg-transparent border-none focus:outline-none w-40 text-[#00d4aa] font-medium"
                                            />
                                            <button
                                                onClick={() => handleRemoveExpertise(index)}
                                                className="text-[#00d4aa] hover:text-red-600"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="px-4 py-2 bg-[#00d4aa]/10 text-[#00d4aa] rounded-full font-medium text-sm">
                                            {skill}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Achievements & Awards</h2>
                            {isEditing && (
                                <button
                                    onClick={handleAddAchievement}
                                    className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors text-sm font-medium"
                                >
                                    + Add Achievement
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {achievements.map((achievement, index) => (
                                <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                                    {isEditing ? (
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Award Title"
                                                    value={achievement.title}
                                                    onChange={(e) => {
                                                        const newAchievements = [...achievements];
                                                        newAchievements[index].title = e.target.value;
                                                        setAchievements(newAchievements);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Organization"
                                                    value={achievement.organization}
                                                    onChange={(e) => {
                                                        const newAchievements = [...achievements];
                                                        newAchievements[index].organization = e.target.value;
                                                        setAchievements(newAchievements);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Year"
                                                    value={achievement.year}
                                                    onChange={(e) => {
                                                        const newAchievements = [...achievements];
                                                        newAchievements[index].year = e.target.value;
                                                        setAchievements(newAchievements);
                                                    }}
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                                                />
                                                <button
                                                    onClick={() => handleRemoveAchievement(achievement.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-600">
                                                    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
                                                    <path d="M12 11v10" stroke="currentColor" strokeWidth="2"/>
                                                    <path d="M8 21h8" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{achievement.title}</div>
                                                <div className="text-sm text-gray-600">{achievement.organization}</div>
                                                <div className="text-sm text-gray-500 mt-1">{achievement.year}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Links</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" fill="currentColor"/>
                                    <circle cx="4" cy="4" r="2" fill="currentColor"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    value={socialMedia.linkedin}
                                    onChange={(e) => setSocialMedia({ ...socialMedia, linkedin: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-sky-500">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Twitter/X</label>
                                <input
                                    type="url"
                                    value={socialMedia.twitter}
                                    onChange={(e) => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="https://twitter.com/yourhandle"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-700">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Facebook</label>
                                <input
                                    type="url"
                                    value={socialMedia.facebook}
                                    onChange={(e) => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="https://facebook.com/yourpage"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="18" cy="6" r="1" fill="currentColor"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Instagram</label>
                                <input
                                    type="url"
                                    value={socialMedia.instagram}
                                    onChange={(e) => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="https://instagram.com/yourhandle"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-600">
                                    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" fill="currentColor"/>
                                    <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="white"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">YouTube</label>
                                <input
                                    type="url"
                                    value={socialMedia.youtube}
                                    onChange={(e) => setSocialMedia({ ...socialMedia, youtube: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="https://youtube.com/@yourchannel"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
