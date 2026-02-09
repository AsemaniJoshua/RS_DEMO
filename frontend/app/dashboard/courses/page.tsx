"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { courseService } from "@/services/course-service";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [level, setLevel] = useState("all");
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [levels, setLevels] = useState<string[]>(["all"]);
    const [categories, setCategories] = useState<string[]>(["all"]);

    useEffect(() => {
        setLoading(true);
        courseService.getMyCourses().then((data) => {
            const coursesArr = Array.isArray(data) ? data : [];
            setCourses(coursesArr);
            // Extract unique levels and categories
            const uniqueLevels = Array.from(new Set(coursesArr.map((c: any) => c.level || "").filter(l => !!l)));
            setLevels(["all", ...uniqueLevels]);
            const uniqueCategories = Array.from(new Set(coursesArr.map((c: any) => c.category?.name || c.category || "").filter(cat => !!cat)));
            setCategories(["all", ...uniqueCategories]);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
            filter === "all" ||
            (filter === "in-progress" && course.status === "in-progress") ||
            (filter === "completed" && course.status === "completed") ||
            (filter === "not-started" && course.status === "not-started");
        const matchesLevel = level === "all" || course.level === level;
        const matchesCategory = category === "all" || (course.category?.name || course.category) === category;
        return matchesSearch && matchesFilter && matchesLevel && matchesCategory;
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
        <>
        <style jsx global>{`
            #course-search, #level-select, #category-select {
                color: #111 !important;
                -webkit-text-fill-color: #111 !important;
                font-weight: 600 !important;
            }
            #level-select option, #category-select option {
                color: #111 !important;
                -webkit-text-fill-color: #111 !important;
                font-weight: 600 !important;
                background: #e0edff !important;
            }
            #category-select option {
                background: #f3e8ff !important;
            }
            #course-search::placeholder {
                color: #1e40af !important;
                -webkit-text-fill-color: #1e40af !important;
                font-weight: 600 !important;
                opacity: 1 !important;
            }
        `}</style>
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                <p className="text-gray-600">Manage your enrolled courses and track progress</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
                    <div className="text-sm text-gray-600">Total Enrolled</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">
                        {courses.filter(c => c.status === "in-progress").length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">
                        {courses.filter(c => c.status === "completed").length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                <div className="flex flex-col md:flex-row gap-4 flex-wrap items-end">
                    <div className="flex-1 relative min-w-[220px]">
                        <label className="block text-sm font-bold text-gray-800 mb-1" htmlFor="course-search">Search</label>
                        <svg className="absolute left-3 top-9 text-blue-500" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            id="course-search"
                            type="text"
                            placeholder="Type to search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-blue-400 rounded-lg focus:border-blue-600 focus:outline-none bg-blue-50"
                            style={{ color: '#000', fontWeight: '600', WebkitTextFillColor: '#000' }}
                        />
                    </div>
                    <div className="flex flex-col gap-1 min-w-[160px]">
                        <label className="block text-sm font-bold text-black mb-1" htmlFor="level-select">Level</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="level-select"
                                value={level}
                                onChange={e => setLevel(e.target.value)}
                                className="px-4 py-2 rounded-lg border-2 border-blue-400 text-sm font-bold bg-blue-50 focus:border-blue-600 focus:outline-none"
                                style={{ color: '#000', fontWeight: '700', WebkitTextFillColor: '#000', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                            >
                                {levels.map(l => (
                                    <option key={l} value={l} style={{ color: '#000', fontWeight: '600', background: '#fff' }}>{l === "all" ? "All Levels" : l}</option>
                                ))}
                            </select>
                            <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#1e40af',fontWeight:700}}>&#9660;</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[160px]">
                        <label className="block text-sm font-bold text-black mb-1" htmlFor="category-select">Category</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                id="category-select"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="px-4 py-2 rounded-lg border-2 border-purple-400 text-sm font-bold bg-purple-50 focus:border-purple-600 focus:outline-none"
                                style={{ color: '#000', fontWeight: '700', WebkitTextFillColor: '#000', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                            >
                                {categories.map(c => (
                                    <option key={c} value={c} style={{ color: '#000', fontWeight: '600', background: '#fff' }}>{c === "all" ? "All Categories" : c}</option>
                                ))}
                            </select>
                            <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'#9333ea',fontWeight:700}}>&#9660;</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-6">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === "all" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            All Statuses
                        </button>
                        <button
                            onClick={() => setFilter("in-progress")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === "in-progress" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === "completed" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilter("not-started")}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filter === "not-started" 
                                    ? "bg-[#0066ff] text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Not Started
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Course Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-[#0066ff] to-[#0052cc] flex items-center justify-center text-white relative">
                            {course.thumbnailUrl ? (
                                <img 
                                    src={course.thumbnailUrl} 
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            )}
                        </div>

                        {/* Course Info */}
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                                    {course.instructor && (
                                        <p className="text-sm text-gray-600">{typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}</p>
                                    )}
                                    <div className="flex gap-2 mt-1">
                                        {course.level && (
                                            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">{typeof course.level === 'object' ? course.level?.name : course.level}</span>
                                        )}
                                        {course.category && (
                                            <span className="inline-block px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-semibold">{typeof course.category === 'object' ? course.category?.name : course.category}</span>
                                        )}
                                    </div>
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
        </>
    );
}
