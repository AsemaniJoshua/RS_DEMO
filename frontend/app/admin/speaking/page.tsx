"use client";

import { useState } from "react";
import Link from "next/link";
import speakingData from "@/data/admin/speaking.json";
import consultingData from "@/data/admin/consulting.json";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";

export default function SpeakingConsultingPage() {
    const [activeTab, setActiveTab] = useState<"speaking" | "consulting">("speaking");
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null; title: string; type: "speaking" | "consulting" }>({
        show: false,
        id: null,
        title: "",
        type: "speaking"
    });

    // Speaking data filtering
    const filteredSpeaking = speakingData.engagements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
        const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Consulting data filtering
    const filteredConsulting = consultingData.projects.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
        const matchesStatus = statusFilter === "All Statuses" || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Calculate stats
    const speakingStats = {
        total: speakingData.engagements.length,
        upcoming: speakingData.engagements.filter(e => e.status === "Upcoming").length,
        completed: speakingData.engagements.filter(e => e.status === "Completed").length,
        totalRevenue: speakingData.engagements.reduce((sum, e) => sum + e.fee, 0)
    };

    const consultingStats = {
        total: consultingData.projects.length,
        active: consultingData.projects.filter(p => p.status === "Active").length,
        completed: consultingData.projects.filter(p => p.status === "Completed").length,
        totalRevenue: consultingData.projects.reduce((sum, p) => sum + p.budget, 0)
    };

    const handleDeleteClick = (id: number, title: string, type: "speaking" | "consulting") => {
        setDeleteModal({ show: true, id, title, type });
    };

    const handleDeleteConfirm = () => {
        console.log(`Deleting ${deleteModal.type} item:`, deleteModal.id);
        setDeleteModal({ show: false, id: null, title: "", type: "speaking" });
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ show: false, id: null, title: "", type: "speaking" });
    };

    const currentCategories = activeTab === "speaking" ? speakingData.categories : consultingData.categories;
    const currentStatuses = activeTab === "speaking" ? speakingData.statuses : consultingData.statuses;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Speaking & Consulting</h1>
                    <p className="text-gray-600">Manage your speaking engagements and consulting projects</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("speaking")}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                        activeTab === "speaking"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Speaking Engagements
                </button>
                <button
                    onClick={() => setActiveTab("consulting")}
                    className={`px-6 py-3 font-semibold transition-colors relative ${
                        activeTab === "consulting"
                            ? "text-[#00d4aa] border-b-2 border-[#00d4aa]"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Consulting Projects
                </button>
            </div>

            {/* Stats Cards */}
            {activeTab === "speaking" ? (
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{speakingStats.total}</div>
                                <div className="text-sm text-gray-600">Total Engagements</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{speakingStats.upcoming}</div>
                                <div className="text-sm text-gray-600">Upcoming</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{speakingStats.completed}</div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">${(speakingStats.totalRevenue / 1000).toFixed(1)}k</div>
                                <div className="text-sm text-gray-600">Total Revenue</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2"/>
                                    <polyline points="7.5 4.21 12 6.81 16.5 4.21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="12" y1="22" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{consultingStats.total}</div>
                                <div className="text-sm text-gray-600">Total Projects</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-500">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{consultingStats.active}</div>
                                <div className="text-sm text-gray-600">Active Projects</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-500">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{consultingStats.completed}</div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                                    <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">${(consultingStats.totalRevenue / 1000).toFixed(1)}k</div>
                                <div className="text-sm text-gray-600">Total Revenue</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder={activeTab === "speaking" ? "Search by title or location..." : "Search by title or client..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        {currentCategories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        {currentStatuses.map((status, idx) => (
                            <option key={idx} value={status}>{status}</option>
                        ))}
                    </select>
                    <Link href={`/admin/speaking/${activeTab}/new`}>
                        <button className="px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors font-medium whitespace-nowrap">
                            + Add {activeTab === "speaking" ? "Engagement" : "Project"}
                        </button>
                    </Link>
                </div>
            </div>

            {/* Speaking Table */}
            {activeTab === "speaking" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Attendees</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fee</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSpeaking.map((engagement, idx) => (
                                    <tr key={engagement.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{engagement.title}</div>
                                            <div className="text-sm text-gray-600">{engagement.venue}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                {engagement.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{new Date(engagement.date).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-600">{engagement.duration}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{engagement.location}</td>
                                        <td className="px-6 py-4 text-gray-900">{engagement.attendees.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">
                                                {engagement.fee > 0 ? `$${engagement.fee.toLocaleString()}` : "Free"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                engagement.status === "Upcoming" ? "bg-green-50 text-green-700" :
                                                engagement.status === "Completed" ? "bg-blue-50 text-blue-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                                {engagement.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/speaking/speaking/${engagement.id}/edit`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(engagement.id, engagement.title, "speaking")}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Consulting Table */}
            {activeTab === "consulting" && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Project</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timeline</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Budget</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredConsulting.map((project, idx) => (
                                    <tr key={project.id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{project.title}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{project.client}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 text-sm">{new Date(project.startDate).toLocaleDateString()}</div>
                                            <div className="text-gray-600 text-sm">to {new Date(project.endDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">${project.budget.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                                    <div 
                                                        className="h-full bg-[#00d4aa] transition-all"
                                                        style={{ width: `${project.completion}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{project.completion}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                project.status === "Active" ? "bg-green-50 text-green-700" :
                                                project.status === "Completed" ? "bg-blue-50 text-blue-700" :
                                                "bg-yellow-50 text-yellow-700"
                                            }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/speaking/consulting/${project.id}/edit`}>
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteClick(project.id, project.title, "consulting")}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <DeleteCourseModal
                isOpen={deleteModal.show}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                courseName={deleteModal.title}
            />
        </div>
    );
}
