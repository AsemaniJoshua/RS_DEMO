"use client";

import { use } from "react";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import userData from "@/data/dashboard/user-profile.json";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const course = userData.enrolledCourses.find(c => c.id === parseInt(id));

    if (!course) {
        return (
            <div className="p-4 md:p-8">
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
                    <p className="text-gray-600 mb-6">This course doesn't exist or you don't have access to it.</p>
                    <Link href="/dashboard/courses">
                        <button className="px-6 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors">
                            Back to Courses
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // Generate mock lessons
    const lessons = Array.from({ length: course.totalLessons }, (_, i) => ({
        id: i + 1,
        title: `Lesson ${i + 1}: Introduction to Topic ${i + 1}`,
        duration: "12 min",
        completed: i < course.completedLessons
    }));

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <BackButton label="Back to My Courses" href="/dashboard/courses" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600">By {course.instructor}</p>
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
                                <p className="text-lg font-semibold">Continue Learning</p>
                            </div>
                        </div>
                    </div>

                    {/* Course Progress */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h2>
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">{course.completedLessons} of {course.totalLessons} lessons completed</span>
                                <span className="text-sm font-semibold text-gray-900">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-[#0066ff] h-3 rounded-full transition-all" 
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                        {course.status === "completed" && (
                            <div className="flex items-center gap-2 text-green-600 mt-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="font-semibold">Course Completed!</span>
                            </div>
                        )}
                    </div>

                    {/* Lessons List */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>
                        <div className="space-y-2">
                            {lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                                        lesson.completed
                                            ? "border-green-200 bg-green-50"
                                            : "border-gray-200 hover:border-[#0066ff]"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        lesson.completed
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                    }`}>
                                        {lesson.completed ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        ) : (
                                            <span className="text-sm font-semibold">{lesson.id}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                                        <p className="text-sm text-gray-600">{lesson.duration}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-sm font-medium">
                                        {lesson.completed ? "Review" : "Start"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Info */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Course Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Enrolled</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(course.enrolledDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Total Lessons</span>
                                <span className="font-medium text-gray-900">{course.totalLessons}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    course.status === "completed" ? "bg-green-50 text-green-700" :
                                    course.status === "in-progress" ? "bg-blue-50 text-blue-700" :
                                    "bg-gray-100 text-gray-700"
                                }`}>
                                    {course.status === "completed" ? "Completed" :
                                     course.status === "in-progress" ? "In Progress" :
                                     "Not Started"}
                                </span>
                            </div>
                            {course.completedDate && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Completed</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(course.completedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                Continue Learning
                            </button>
                            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                Download Materials
                            </button>
                            {course.status === "completed" && (
                                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    Get Certificate
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
