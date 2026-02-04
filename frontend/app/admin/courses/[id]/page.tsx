"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { courseService, Course } from "@/services/course-service";
import toast from "react-hot-toast";
import { 
    ArrowLeft, 
    Edit2, 
    Calendar, 
    Users, 
    Folder, 
    Clock, 
    DollarSign,
    ImageIcon,
    FileText,
    CheckCircle
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const { isAdminOrEditor } = useAuth();

    const handleDownload = async () => {
        if (!course) return;
        setDownloading(true);
        try {
            const result = await courseService.downloadCourse(course.id);
            if (!result?.downloadUrl) {
                toast.error("Failed to download course materials");
            }
            // If downloadUrl exists, downloadCourse already triggers download
        } catch (error: any) {
            toast.error("Failed to download course materials");
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const course: any = await courseService.getCourseById(id);
                setCourse(course);
            } catch (error: any) {
                console.error("Failed to load course details", error);
                toast.error("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-green-50 text-green-700 border-green-100';
            case 'DRAFT': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'ARCHIVED': return 'bg-gray-50 text-gray-700 border-gray-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                <p className="text-gray-600 mb-4">The course you are looking for does not exist.</p>
                <Link href="/admin/courses" className="px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors">
                    Back to Course List
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/courses"
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Course Details</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>ID: {course.id.slice(0, 8)}...</span>
                            <span>•</span>
                            <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/admin/courses/${course.id}/edit`}>
                        <button className="px-5 py-2.5 bg-[#00d4aa] text-white rounded-xl hover:bg-[#00bfa6] transition-colors font-medium flex items-center gap-2 shadow-sm shadow-teal-500/20">
                            <Edit2 className="w-4 h-4" />
                            Edit Course
                        </button>
                    </Link>
                </div>
            </div>

            {/* Thumbnail Banner */}
            {course.thumbnailUrl ? (
                <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <img 
                        src={course.thumbnailUrl} 
                        alt={course.title} 
                        className="w-full h-64 md:h-100 object-cover"
                    />
                </div>
            ) : (
                <div className="mb-8 bg-linear-to-br from-[#00d4aa] to-[#00bfa6] rounded-2xl border border-gray-100 shadow-sm h-48 md:h-64 flex flex-col items-center justify-center text-white">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                    <span className="text-xl font-bold">{course.title}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overview Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(course.status)}`}>
                                    {course.status}
                                </span>
                                {course.category && (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                                        <Folder className="w-3 h-3" />
                                        {course.category.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Price
                                </div>
                                <div className="font-semibold text-gray-900">
                                    {Number(course.price) === 0 ? "Free" : `GHS ${course.price}`}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration
                                </div>
                                <div className="font-semibold text-gray-900">
                                    {course.duration || "Self-paced"}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Students
                                </div>
                                <div className="font-semibold text-gray-900">
                                    {course.students || 0}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Updated
                                </div>
                                <div className="font-semibold text-gray-900">
                                    {new Date(course.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                        <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap">
                            {course.description}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Course Materials */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Course Materials</h3>
                        
                        {course.fileUrl && isAdminOrEditor() ? (
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">Course Content</div>
                                        <div className="text-xs text-gray-500">ZIP Archive</div>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    onClick={handleDownload}
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>Download Materials</>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No downloadable materials available or you do not have access.</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats / Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-[#00d4aa] mt-0.5" />
                                <div>
                                    <div className="font-medium text-gray-900">Full Lifetime Access</div>
                                    <div className="text-sm text-gray-500">Students get unlimited access</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
