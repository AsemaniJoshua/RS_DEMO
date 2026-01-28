"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { courseService } from "@/services/course-service";
import CategoryManagerModal from "@/components/admin/CategoryManagerModal";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";
import toast from "react-hot-toast";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // Categories from backend
    const [loading, setLoading] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const [selectedStatus, setSelectedStatus] = useState("All");
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; courseId: string | null; courseName: string }>({
        isOpen: false,
        courseId: null,
        courseName: ""
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesData, categoriesData] = await Promise.all([
                courseService.getAllCourses(),
                courseService.getCategories()
            ]);
            // Service already returns response.data, so simply use the returned value
            setCourses(coursesData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            // Log error for debugging but suppress explicit console.error if requested
            console.error("Failed to fetch data", error);
            toast.error("Failed to fetch courses. Please check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (course.category?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || course.category?.name === selectedCategory;
        const matchesStatus = selectedStatus === "All" || course.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleDeleteClick = (courseId: string, courseName: string) => {
        setDeleteModal({ isOpen: true, courseId, courseName });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.courseId) return;
        try {
            await courseService.deleteCourse(deleteModal.courseId);
            setCourses(courses.filter(c => c.id !== deleteModal.courseId));
            setDeleteModal({ isOpen: false, courseId: null, courseName: "" });
        } catch (error) {
            console.error("Error deleting course", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, courseId: null, courseName: "" });
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Courses Management</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage your online courses and learning materials</p>
                </div>
                <Link href="/admin/courses/new">
                    <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Add New Course
                    </button>
                </Link>
            </div>

            <div className="flex justify-end mb-6">
                 <button 
                    onClick={() => setShowCategoryModal(true)}
                    className="text-sm text-[#00d4aa] hover:text-[#00bfa6] font-medium flex items-center gap-1 cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Manage Categories
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
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
                    <div className="text-2xl font-bold text-gray-900">{courses.filter(c => c.status === "PUBLISHED").length}</div>
                </div>
                {/* Other stats can be added similarly */}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
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
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All Categories">All Categories</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        <option value="All">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[768px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Course</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Students</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCourses.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No courses found
                                </td>
                            </tr>
                        ) : (
                            filteredCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => window.location.href=`/admin/courses/${course.id}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {course.thumbnailUrl ? (
                                                <img src={course.thumbnailUrl} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] rounded-lg flex items-center justify-center text-white font-bold">
                                                    {course.title.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-gray-900">{course.title}</div>
                                                <div className="text-sm text-gray-500">Self-paced</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{course.category?.name || 'Uncategorized'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">{course.students || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 font-medium">
                                            {Number(course.price) === 0 ? "Free" : `GHS ${course.price}`}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            course.status === "PUBLISHED" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/courses/${course.id}`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </Link>
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
            </div>

            {/* Delete Modal */}
            <DeleteCourseModal
                isOpen={deleteModal.isOpen}
                courseName={deleteModal.courseName}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

            {/* Category Modal */}
            <CategoryManagerModal 
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onUpdate={fetchData}
            />
        </div>
    );
}
