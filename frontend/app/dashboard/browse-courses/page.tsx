"use client";

import { useState } from "react";
import Link from "next/link";
import catalogData from "@/data/dashboard/course-catalog.json";

export default function BrowseCoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedLevel, setSelectedLevel] = useState("All Levels");

    // Filter courses
    const filteredCourses = catalogData.courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
        const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
                <p className="text-gray-600">Discover and enroll in professional development courses</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
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

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                    >
                        {catalogData.categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    {/* Level Filter */}
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:border-[#0066ff] focus:outline-none"
                    >
                        <option value="All Levels">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    Showing {filteredCourses.length} of {catalogData.courses.length} courses
                </p>
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
                            {/* Category & Level */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                    {course.category}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
                                    {course.level}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                            
                            {/* Instructor */}
                            <p className="text-sm text-gray-600 mb-3">By {course.instructor}</p>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
                                    </svg>
                                    {course.rating}
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    {course.students.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    {course.duration}
                                </div>
                            </div>

                            {/* Price & CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="text-2xl font-bold text-gray-900">{course.price}</div>
                                <Link href={`/dashboard/browse-courses/${course.id}`}>
                                    <button className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                        View Details
                                    </button>
                                </Link>
                            </div>
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
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("All Categories");
                            setSelectedLevel("All Levels");
                        }}
                        className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </div>
    );
}
