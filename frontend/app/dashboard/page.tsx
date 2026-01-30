"use client";

import { useState } from "react";
import Link from "next/link";
import userData from "@/data/dashboard/user-profile.json";

export default function DashboardHome() {
    const { user, enrolledCourses, upcomingAppointments } = userData;
    const { stats } = user;

    // Get in-progress courses
    const inProgressCourses = enrolledCourses.filter(c => c.status === "in-progress").slice(0, 3);
    
    // Get next appointment
    const nextAppointment = upcomingAppointments[0];

    return (
        <div className="p-4 md:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    Welcome back, {user.name.split(' ')[0]}!
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="currentColor"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="9" cy="9" r="1" fill="white"/>
                        <circle cx="15" cy="9" r="1" fill="white"/>
                    </svg>
                </h1>
                <p className="text-gray-600">Here's your learning progress and upcoming activities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#0066ff] to-[#0052cc] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{stats.coursesEnrolled}</div>
                            <div className="text-sm opacity-90">Enrolled Courses</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#00d4aa] to-[#00bfa6] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{stats.appointmentsBooked}</div>
                            <div className="text-sm opacity-90">Appointments</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{stats.totalLearningHours}h</div>
                            <div className="text-sm opacity-90">Learning Hours</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-3xl font-bold">{stats.savedItems}</div>
                            <div className="text-sm opacity-90">Saved Items</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Continue Learning */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
                        <Link href="/dashboard/courses" className="text-sm text-[#0066ff] hover:underline">
                            View All →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {inProgressCourses.map((course) => (
                            <div key={course.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#0066ff] transition-colors">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#0066ff] to-[#0052cc] rounded-lg flex items-center justify-center text-white font-bold">
                                    {course.progress}%
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-[#0066ff] h-2 rounded-full transition-all" 
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <Link href={`/dashboard/courses/${course.id}`}>
                                    <button className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors text-sm font-medium">
                                        Continue
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Appointment */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Next Appointment</h2>
                    {nextAppointment ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-[#00d4aa]/10 to-[#00bfa6]/10 border border-[#00d4aa]/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 bg-[#00d4aa] rounded-lg flex items-center justify-center text-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{nextAppointment.type}</div>
                                        <div className="text-sm text-gray-600">{nextAppointment.mode}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {nextAppointment.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {nextAppointment.time}
                                    </div>
                                    <div className="pt-2">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {nextAppointment.status}
                                        </span>
                                    </div>
                                </div>
                                {nextAppointment.mode === "Virtual" && nextAppointment.meetingLink && (
                                    <button className="w-full mt-4 px-4 py-2 bg-[#00d4aa] text-white rounded-lg hover:bg-[#00bfa6] transition-colors text-sm font-medium">
                                        Join Meeting
                                    </button>
                                )}
                            </div>
                            <Link href="/dashboard/appointments">
                                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                    View All Appointments
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No upcoming appointments</p>
                    )}
                </div>
            </div>

        </div>
    );
}
