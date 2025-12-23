"use client";

import { useState } from "react";
import Link from "next/link";
import coursesData from "@/data/admin/courses.json";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; courseId: number | null; courseName: string }>({
        isOpen: false,
        courseId: null,
        courseName: ""
    });

    const { courses, categories } = coursesData;

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            course.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
        const matchesStatus = selectedStatus === "All" || course.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDeleteClick = (courseId: number, courseName: string) => {
        setDeleteModal({ isOpen: true, courseId, courseName });
    };

    const handleDeleteConfirm = () => {
        // Here you would typically send delete request to backend
        console.log("Deleting course:", deleteModal.courseId);
        setDeleteModal({ isOpen: false, courseId: null, courseName: "" });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, courseId: null, courseName: "" });
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Management</h1>
                    <p className="text-gray-600">Manage your online courses and learning materials</p>
                </div>
                <Link href="/admin/courses/new">
                    <button className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center gap-2 font-medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Add New Course
                    </button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Courses</span>
                        <div className="w-10 h-10 bg-[#00d4aa]/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#00d4aa]">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Published</span>
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{courses.filter(c => c.status === "Published").length}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Students</span>
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{courses.reduce((sum, c) => sum + c.students, 0)}</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Avg Rating</span>
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {(courses.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / courses.filter(c => c.rating > 0).length).toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Course</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Students</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCourses.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No courses found
                                </td>
                            </tr>
                        ) : (
                            filteredCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] rounded-lg flex items-center justify-center text-white font-bold">
                                                {course.title.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{course.title}</div>
                                                <div className="text-sm text-gray-500">{course.duration}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{course.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">{course.students}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">{course.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {course.rating > 0 ? (
                                            <div className="flex items-center gap-1">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                                                </svg>
                                                <span className="text-sm text-gray-900 font-medium">{course.rating}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            course.status === "Published" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/courses/${course.id}/edit`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteClick(course.id, course.title)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Delete"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-600">
                                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            <DeleteCourseModal
                isOpen={deleteModal.isOpen}
                courseName={deleteModal.courseName}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}
