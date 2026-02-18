"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import toast from "react-hot-toast";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError("");
        // Fetch course from backend (purchased course from my library)
        courseService.getUserCourseById(id)
            .then((data) => {
                setCourse(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load course details.");
                setLoading(false);
            });
    }, [id]);

    const handleDownload = async () => {
        if (!course) return;
        setDownloading(true);
        try {
            await courseService.downloadUserCourse(course.id);
            toast.success(`${course.title} downloaded successfully!`);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to download course');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0066ff] mb-4"></div>
                <p className="text-gray-600 font-medium">Loading course details...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="p-4 md:p-8">
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "This course doesn't exist or you don't have access to it."}</p>
                    <Link href="/dashboard/courses">
                        <button className="px-6 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors">
                            Back to My Courses
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <Link 
                    href="/dashboard/courses" 
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0066ff] transition-colors mb-4"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Back to My Courses</span>
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                {course.instructor && (
                    <p className="text-gray-600">By {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Course Preview */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="aspect-video relative bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white">
                            {course.thumbnailUrl ? (
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <p className="text-lg font-semibold">Course Content</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                {course.category && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        {typeof course.category === 'object' ? course.category?.name : course.category}
                                    </span>
                                )}
                                {(course.level || (typeof course.level === 'object' && course.level?.name)) && (
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                        {typeof course.level === 'object' ? course.level?.name : course.level}
                                    </span>
                                )}
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                                    Purchased
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">Course Overview</h2>
                            <div 
                                className="prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ 
                                    __html: course.description || 'Enjoy your purchased course. Download it below to access all materials.' 
                                }}
                            />
                        </div>
                    </div>

                    {/* Course Details */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Information</h2>
                        <div className="space-y-3 text-sm">
                            {course.duration && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-medium text-gray-900">{course.duration}</span>
                                </div>
                            )}
                            {course.category && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium text-gray-900">{typeof course.category === 'object' ? course.category?.name : course.category}</span>
                                </div>
                            )}
                            {(course.level || (typeof course.level === 'object' && course.level?.name)) && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Level</span>
                                    <span className="font-medium text-gray-900">{typeof course.level === 'object' ? course.level?.name : course.level}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium text-green-600">Purchased</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Download Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Course Access</h3>
                            <p className="text-sm text-gray-600">You own this course. Download it to access all materials.</p>
                        </div>
                        
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="w-full px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {downloading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Downloading...</span>
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Download Course</span>
                                </>
                            )}
                        </button>

                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Includes:</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    All course materials
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    Downloadable resources
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    Lifetime access
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    Re-download anytime
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
