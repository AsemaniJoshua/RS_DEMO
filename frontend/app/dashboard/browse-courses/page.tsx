"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { courseService } from "@/services/course-service";

export default function BrowseCoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(["All Categories"]);

    useEffect(() => {
        // Fetch categories from backend (or fallback to static)
        courseService.getCategories().then((data) => {
            if (Array.isArray(data)) {
                setCategories(["All Categories", ...data.map((cat: any) => cat.name)]);
            }
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        courseService.getUserCourses(
            selectedCategory,
            selectedLevel,
            searchQuery
        ).then((data) => {
            setCourses(Array.isArray(data) ? data : []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [selectedCategory, selectedLevel, searchQuery]);

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

    // Filtered courses for empty state
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || (course.category?.name || course.category) === selectedCategory;
        const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

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
                        {categories.map((category) => (
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
                    {!loading && `Showing ${courses.length} courses`}
                </p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0066ff] mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading courses...</p>
                    </div>
                ) : courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Course Thumbnail */}
                            <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                {course.thumbnailUrl ? (
                                    <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-300">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Course Info */}
                            <div className="p-5">
                                {/* Category & Level */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                        {course.category?.name || course.category || ""}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(course.level)}`}>
                                        {course.level}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                                {/* Instructor */}
                                {course.instructor && (
                                    <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                                )}
                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                {/* Stats */}
                                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                    {/* Duration */}
                                    <div className="flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {course.duration || "-"}
                                    </div>
                                    {/* Status */}
                                    <div className="flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {course.status || "-"}
                                    </div>
                                    {/* Created At */}
                                    <div className="flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {course.created_at ? new Date(course.created_at).toLocaleDateString() : "-"}
                                    </div>
                                </div>
                                {/* Price & CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="text-xl font-bold text-gray-900">
                                        GHS {Number(course.price).toLocaleString()}
                                    </div>
                                    <Link href={`/dashboard/browse-courses/${course.id}`}>
                                        <button className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center text-gray-500 py-12">
                        <svg className="mx-auto mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
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

            {/* Empty State removed: handled in grid above */}
        </div>
    );
}
