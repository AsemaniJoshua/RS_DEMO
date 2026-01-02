"use client";

import { useState } from "react";
import Link from "next/link";
import userData from "@/data/dashboard/user-profile.json";

export default function MyCoursesPage() {
    const { enrolledCourses } = userData;
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter courses
    const filteredCourses = enrolledCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = 
            filter === "all" ||
            (filter === "in-progress" && course.status === "in-progress") ||
            (filter === "completed" && course.status === "completed") ||
            (filter === "not-started" && course.status === "not-started");
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-50 text-green-700";
            case "in-progress":
                return "bg-blue-50 text-blue-700";
            case "not-started":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "completed":
                return "Completed";
            case "in-progress":
                return "In Progress";
            case "not-started":
                return "Not Started";
            default:
                return status;
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                <p className="text-gray-600">Manage your enrolled courses and track progress</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
                    <div className="text-sm text-gray-600">Total Enrolled</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">
                        {enrolledCourses.filter(c => c.status === "in-progress").length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                        {enrolledCourses.filter(c => c.status === "completed").length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === "all" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("in-progress")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === "in-progress" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filter === "completed" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Course Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>

                        {/* Course Info */}
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                                    <p className="text-sm text-gray-600">{course.instructor}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                                    {getStatusLabel(course.status)}
                                </span>
                            </div>

                            {/* Progress */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-semibold text-gray-900">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-[#0066ff] h-2 rounded-full transition-all" 
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {course.completedLessons} / {course.totalLessons} lessons completed
                                </div>
                            </div>

                            {/* Action Button */}
                            <Link href={`/dashboard/courses/${course.id}`}>
                                <button className="w-full px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                    {course.status === "completed" ? "Review Course" : 
                                     course.status === "not-started" ? "Start Course" : 
                                     "Continue Learning"}
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
}
