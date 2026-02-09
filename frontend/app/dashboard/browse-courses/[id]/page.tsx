"use client";


import { use, useEffect, useState } from "react";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import { useAuth } from "@/contexts/auth-context";
import toast from "react-hot-toast";


export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError("");
        courseService.getUserCourseById(id)
            .then((data) => {
                // Backend returns { course, isPurchased }
                setCourse(data.course || data);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load course details.");
                setLoading(false);
            });
    }, [id]);

    const handleEnroll = async () => {
        if (!course || !user?.email) {
            toast.error('Please log in to enroll in this course');
            return;
        }

        setIsProcessingPayment(true);
        try {
            // Create callback URL for payment verification
            const callbackUrl = `${window.location.origin}/dashboard/verify-course-payment`;
            
            // Initiate payment
            const response = await courseService.purchaseCourse(course.id, user.email, callbackUrl);
            
            // Redirect to payment gateway
            if (response?.authorization_url) {
                window.location.href = response.authorization_url;
            } else {
                toast.error('Payment initialization failed. Please try again.');
                setIsProcessingPayment(false);
            }
        } catch (err: any) {
            const errorMessage = err?.message || err?.response?.data?.message || 'Failed to initiate payment';
            toast.error(errorMessage);
            setIsProcessingPayment(false);
            setShowEnrollModal(false);
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Beginner":
                return "bg-green-50 text-green-700";
            case "Intermediate":
                return "bg-yellow-50 text-yellow-700";
            case "Advanced":
                return "bg-purple-50 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
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
                    <p className="text-gray-600 mb-6">{error || "This course doesn't exist in our catalog."}</p>
                    <Link href="/dashboard/browse-courses">
                        <button className="px-6 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors">
                            Browse Courses
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
                    href="/dashboard/browse-courses" 
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-[#0066ff] transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
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
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <polygon points="10 8 16 12 10 16" fill="currentColor"/>
                                    </svg>
                                    <p className="text-lg font-semibold">Course Preview</p>
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
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(typeof course.level === 'object' ? course.level?.name : course.level)}`}>
                                        {typeof course.level === 'object' ? course.level?.name : course.level}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.status === 'PUBLISHED' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}`}>
                                    {course.status || 'Available'}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
                            {course.instructor && (
                                <p className="text-gray-600 mb-4">Instructor: {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}</p>
                            )}
                            <p className="text-gray-700 mb-6">{course.description}</p>

                            {/* Stats */}
                            {(course.rating || course.students) && (
                                <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
                                    {course.rating && (
                                        <div className="flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                                            </svg>
                                            <span className="font-semibold">{course.rating}</span> rating
                                        </div>
                                    )}
                                    {course.students && (
                                        <div className="flex items-center gap-2">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            {course.students.toLocaleString()} students
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* What You'll Learn */}
                    {/* {course.highlights && course.highlights.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">What You'll Learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {course.highlights.map((highlight, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <svg className="mt-0.5 flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <polyline points="20 6 9 17 4 12" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span className="text-gray-700">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Course Content */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>
                        <div className="space-y-2">
                            {(course.lessons || course.duration) && (
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    {course.lessons && <span>{course.lessons} lessons</span>}
                                    {course.duration && <span>{course.duration} total duration</span>}
                                </div>
                            )}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    {course.duration ? `This ${course.duration} course includes ` : 'This course includes '}
                                    video lectures, downloadable resources, and materials that will be available after enrollment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Enrollment Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
                        <div className="text-xl font-bold text-gray-900 mb-4">
                            GHS {typeof course.price === 'number' ? course.price.toLocaleString() : parseFloat(course.price).toLocaleString()}
                        </div>
                        <button
                            onClick={() => setShowEnrollModal(true)}
                            className="w-full px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium mb-4"
                        >
                            Enroll Now
                        </button>
                        <div className="space-y-3 text-sm">
                            {course.duration && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-medium text-gray-900">{course.duration}</span>
                                </div>
                            )}
                            {course.lessons && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Lessons</span>
                                    <span className="font-medium text-gray-900">{course.lessons}</span>
                                </div>
                            )}
                            {(course.level || (typeof course.level === 'object' && course.level?.name)) && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Level</span>
                                    <span className="font-medium text-gray-900">{typeof course.level === 'object' ? course.level?.name : course.level}</span>
                                </div>
                            )}
                            {course.students && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Students</span>
                                    <span className="font-medium text-gray-900">{course.students.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className="font-medium text-gray-900">{course.status || 'Available'}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
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
                                    Downloadable resources
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    Mobile access
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrollment Modal */}
            {showEnrollModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowEnrollModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Enrollment</h3>
                            <p className="text-gray-700 mb-6">
                                You're about to enroll in <strong>{course.title}</strong> for GHS {typeof course.price === 'number' ? course.price.toLocaleString() : parseFloat(course.price).toLocaleString()}.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEnrollModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEnroll}
                                    disabled={isProcessingPayment}
                                    className="flex-1 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessingPayment ? 'Processing...' : 'Confirm & Enroll'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
