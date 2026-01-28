"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import toast from "react-hot-toast";

interface CourseDetailPageProps {
    params: {
        id: string;
    };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        loadCourse();
    }, [params.id]);

    const loadCourse = async () => {
        try {
            const res = await courseService.getCourseById(params.id);
            setCourse(res.data);
        } catch (error) {
            console.error("Failed to load course", error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await courseService.downloadCourse(params.id);
            toast.success("Download started");
        } catch (error: any) {
            console.error("Download failed", error);
            toast.error(error.response?.data?.message || "Failed to download course");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading course...</div>;
    if (!course) return <div className="p-8 text-center">Course not found</div>;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/courses">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back to Courses
                    </button>
                </Link>
                <Link href={`/admin/courses/${course.id}/edit`}>
                    <button className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors">
                        Edit Course
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#00d4aa]/10 text-[#00d4aa] text-sm font-medium mb-3">
                                    {course.category?.name || "Uncategorized"}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                                <p className="text-gray-500">Created on {new Date(course.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                course.status === "PUBLISHED" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-gray-100 text-gray-700"
                            }`}>
                                {course.status}
                            </span>
                        </div>
                        
                        <div className="prose max-w-none text-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                            <p className="whitespace-pre-wrap">{course.description}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Card */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="aspect-video bg-gray-100 relative">
                             {course.thumbnailUrl ? (
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] text-white font-bold text-4xl">
                                    {course.title.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-gray-600">Price</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    {Number(course.price) === 0 ? "Free" : `GHS ${course.price}`}
                                </span>
                            </div>

                            <button
                                onClick={handleDownload}
                                disabled={downloading || (!course.isPurchased && course.price > 0)} // Admin logic handled in backend, but frontend assumes admin since this is admin route. Actually users also use this route? No, users will have a separate view presumably or this one adapts. For ADMIN, isPurchased should be true from backend.
                                className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {downloading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Download Course Content
                                    </>
                                )}
                            </button>
                            {(!course.isPurchased && course.price > 0) && (
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    (Purchase required to download)
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <h3 className="font-semibold text-gray-900 mb-4">Course Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Students</span>
                                <span className="font-medium text-gray-900">{course.purchases?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Last Updated</span>
                                <span className="font-medium text-gray-900">{new Date(course.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
