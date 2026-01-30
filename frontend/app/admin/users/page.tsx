"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usersService, User, UserStats } from "@/services/users-service";
import DeleteCourseModal from "@/components/admin/DeleteCourseModal";
import { ApiError } from "@/lib/api";
import toast from 'react-hot-toast';

// Role and status options for filters
const roles = ["All Roles", "ADMIN", "PATIENT", "EDITOR"];
const statuses = ["All Statuses", "ACTIVE", "SUSPENDED"];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null; name: string; role: string }>({
        show: false,
        id: null,
        name: "",
        role: ""
    });
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch users from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch both users and stats in parallel
                const [usersResponse, statsResponse] = await Promise.all([
                    usersService.getAllUsers(),
                    usersService.getUserStats()
                ]);
                
                // Validate responses
                if (usersResponse.status !== 'success') {
                    throw new Error(usersResponse.message || 'Failed to load users');
                }
                if (statsResponse.status !== 'success') {
                    throw new Error(statsResponse.message || 'Failed to load statistics');
                }
                
                setUsers(usersResponse.data || []);
                setStats(statsResponse.data || null);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter users
    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
        const matchesStatus = statusFilter === "All Statuses" || user.account_status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Calculate stats from API data or use empty object
    const displayStats = stats || {
        total: 0,
        byStatus: { active: 0, suspended: 0 },
        byRole: { admin: 0, editor: 0, patient: 0 }
    };

    const handleDeleteClick = (id: string, firstName: string, lastName: string, role: string) => {
        setDeleteModal({ show: true, id, name: `${firstName} ${lastName}`, role });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.id) return;
        
        setIsDeleting(true);
        try {
            const response = await usersService.deleteUserById(deleteModal.id);
            
            // Validate response
            if (response.status !== 'success') {
                throw new Error(response.message || 'Failed to delete user');
            }
            
            // Remove user from local state
            setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
            
            // Refresh stats after deletion
            try {
                const statsResponse = await usersService.getUserStats();
                if (statsResponse.status === 'success') {
                    setStats(statsResponse.data || null);
                }
            } catch (statsErr) {
                // Stats refresh failed, but user was deleted successfully
                console.error('Failed to refresh stats:', statsErr);
            }
            
            // Close modal and show success
            setDeleteModal({ show: false, id: null, name: "", role: "" });
            toast.success(`${deleteModal.role === 'ADMIN' ? 'Administrator' : deleteModal.role === 'EDITOR' ? 'Editor' : 'User'} deleted successfully`);
        } catch (err) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || "Failed to delete user";
            
            // Show error toast with custom styling
            toast.error(errorMessage, {
                duration: 5000, // Longer duration for errors
            });
            
            // Keep modal open so user can retry
            setError(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ show: false, id: null, name: "", role: "" });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-50 text-green-700";
            case "INACTIVE":
                return "bg-gray-100 text-gray-700";
            case "SUSPENDED":
                return "bg-red-50 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "bg-purple-50 text-purple-700";
            case "EDITOR":
                return "bg-blue-50 text-blue-700";
            case "PATIENT":
                return "bg-teal-50 text-teal-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 md:p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-800 font-medium">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-sm md:text-base text-gray-600">Manage user accounts and permissions</p>
                </div>
                <Link href="/admin/users/new">
                    <button className="w-full sm:w-auto px-6 py-3 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors flex items-center justify-center gap-2 font-medium">
                        + Add New User
                    </button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-500">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{displayStats.total}</div>
                            <div className="text-sm text-gray-600">Total Users</div>
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
                            <div className="text-2xl font-bold text-gray-900">{displayStats.byStatus.active}</div>
                            <div className="text-sm text-gray-600">Active Users</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-500">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{displayStats.byStatus.suspended}</div>
                            <div className="text-sm text-gray-600">Suspended</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                            />
                        </div>
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        {roles.map((role, idx) => (
                            <option key={idx} value={role}>{role}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-auto px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                    >
                        {statuses.map((status, idx) => (
                            <option key={idx} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, idx) => (
                                <tr 
                                    key={user.id} 
                                    className={`border-b border-gray-100 ${
                                        user.account_status === 'SUSPENDED' 
                                            ? 'bg-red-50/50 hover:bg-red-50' 
                                            : idx % 2 === 0 ? 'bg-white hover:bg-gray-50/30' : 'bg-gray-50/50 hover:bg-gray-50'
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] flex items-center justify-center text-white font-semibold">
                                                {getInitials(user.first_name, user.last_name)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.account_status)}`}>
                                            {user.account_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 text-gray-900">{formatDate(user.created_at)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="View Details">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                            </Link>
                                            <Link href={`/admin/users/${user.id}/edit`}>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="Edit User">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteClick(user.id, user.first_name, user.last_name, user.role)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                title="Delete User"
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

            {/* Delete Confirmation Modal */}
            <DeleteCourseModal
                isOpen={deleteModal.show}
                courseName={deleteModal.name}
                userRole={deleteModal.role}
                isDeleting={isDeleting}
                error={error}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
}
