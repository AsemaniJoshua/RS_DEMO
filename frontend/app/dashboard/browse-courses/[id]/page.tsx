"use client";

import { use, useState } from "react";
import Link from "next/link";
import catalogData from "@/data/dashboard/course-catalog.json";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const course = catalogData.courses.find(c => c.id === parseInt(id));
    const [showEnrollModal, setShowEnrollModal] = useState(false);

    if (!course) {
        return (
            <div className="p-4 md:p-8">
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                    <p className="text-gray-600 mb-6">This course doesn't exist in our catalog.</p>
                    <Link href="/dashboard/browse-courses">
                        <button className="px-6 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors">
                            Browse Courses
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleEnroll = () => {
        console.log("Enrolling in course:", course.id);
        setShowEnrollModal(false);
        // Redirect or show success message
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
                        <div className="aspect-video bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white">
                            <div className="text-center">
                                <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <polygon points="10 8 16 12 10 16" fill="currentColor"/>
                                </svg>
                                <p className="text-lg font-semibold">Course Preview</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                    {course.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                                    {course.level}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
                            <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                            <p className="text-gray-700 mb-6">{course.description}</p>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-200 pt-4">
                                <div className="flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                                    </svg>
                                    <span className="font-semibold">{course.rating}</span> rating
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    {course.students.toLocaleString()} students
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What You'll Learn */}
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

                    {/* Course Content */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{course.lessons} lessons</span>
                                <span>{course.duration} total duration</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Detailed curriculum will be available after enrollment. 
                                    This course includes video lectures, downloadable resources, quizzes, and a certificate of completion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Enrollment Card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-6">
                        <div className="text-3xl font-bold text-gray-900 mb-4">{course.price}</div>
                        <button
                            onClick={() => setShowEnrollModal(true)}
                            className="w-full px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium mb-4"
                        >
                            Enroll Now
                        </button>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Duration</span>
                                <span className="font-medium text-gray-900">{course.duration}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Lessons</span>
                                <span className="font-medium text-gray-900">{course.lessons}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Level</span>
                                <span className="font-medium text-gray-900">{course.level}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Students</span>
                                <span className="font-medium text-gray-900">{course.students.toLocaleString()}</span>
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
                                    Certificate of completion
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
                                You're about to enroll in <strong>{course.title}</strong> for {course.price}.
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
                                    className="flex-1 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium"
                                >
                                    Confirm & Enroll
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
