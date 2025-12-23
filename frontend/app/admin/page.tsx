"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Import JSON data
import analyticsData from "@/data/admin/analytics.json";
import appointmentsData from "@/data/admin/appointments.json";
import activitiesData from "@/data/admin/activities.json";
import quickActionsData from "@/data/admin/quickActions.json";
import chartDataImport from "@/data/admin/chartData.json";

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [hoveredDate, setHoveredDate] = useState<number | null>(null);
    const [chartProgress, setChartProgress] = useState(0);

    useEffect(() => {
        setMounted(true);
        // Animate chart
        setTimeout(() => {
            setChartProgress(100);
        }, 500);
    }, []);

    // Analytics icons
    const analyticsIcons: { [key: string]: JSX.Element } = {
        patients: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        appointments: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        revenue: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        courses: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            </svg>
        )
    };

    // Quick action icons
    const quickActionIcons: { [key: string]: JSX.Element } = {
        appointment: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        article: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        course: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2"/>
            </svg>
        )
    };

    // Extract data from JSON imports
    const analytics = analyticsData.analytics;
    const appointments = appointmentsData.appointments || {};
    const appointmentDates = appointmentsData.appointmentDates || [];
    const recentActivities = activitiesData.recentActivities;
    const quickActions = quickActionsData.quickActions;
    const revenueData = chartDataImport.revenueData;
    const pieChartData = chartDataImport.pieChartData;

    // Calendar functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="px-4 md:px-8 py-4 md:py-6">
                <div 
                    className={`bg-gradient-to-r from-[#1a1f35] via-[#2a3f55] to-[#00d4aa] rounded-2xl p-4 md:p-8 relative overflow-hidden transform transition-all duration-700 ${
                        mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                    }`}
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4aa]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="text-white flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Dr. George!</h2>
                            <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">Here's what's happening with your practice today</p>
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                <div className="bg-white/10 backdrop-blur-sm px-4 md:px-5 py-2 md:py-3 rounded-lg border border-white/20">
                                    <div className="text-xs text-gray-300">Today's Appointments</div>
                                    <div className="text-xl md:text-2xl font-bold">12</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm px-4 md:px-5 py-2 md:py-3 rounded-lg border border-white/20">
                                    <div className="text-xs text-gray-300">Pending Reviews</div>
                                    <div className="text-xl md:text-2xl font-bold">5</div>
                                </div>
                            </div>
                        </div>
                        <div className={`hidden md:block ml-8 transform transition-all duration-1000 ${mounted ? 'scale-100 rotate-0' : 'scale-0 rotate-12'}`}>
                            <div className="relative">
                                <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
                                    <Image 
                                        src="/dr-george.png" 
                                        alt="Dr. George" 
                                        width={160}
                                        height={160}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="px-4 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    {analytics.map((item, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-lg hover:scale-105 ${
                                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }`}
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                                {analyticsIcons[item.id]}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                <div className="text-sm text-green-600 font-semibold">{item.change}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Performance Chart */}
                    <div className="lg:col-span-8 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                                <p className="text-sm text-gray-500 mt-1">Last 6 months performance</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-sm bg-[#00d4aa] text-white rounded-lg">6M</button>
                                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">1Y</button>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-4 px-4">
                            {revenueData.map((item, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full">
                                        {/* Value tooltip on hover */}
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            {item.amount}
                                        </div>
                                        {/* Bar */}
                                        <div 
                                            className="w-full bg-gradient-to-t from-[#00d4aa] to-[#00bfa6] rounded-t-lg transition-all duration-700 hover:from-[#0066ff] hover:to-[#0052cc] cursor-pointer"
                                            style={{ 
                                                height: mounted ? `${item.value * 2.4}px` : '0px',
                                                transitionDelay: `${idx * 100}ms`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="lg:col-span-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Distribution</h3>
                        <div className="flex items-center justify-center">
                            <svg width="200" height="200" viewBox="0 0 200 200">
                                <circle cx="100" cy="100" r="80" fill="#e5e7eb"/>
                                <path 
                                    d="M 100 20 A 80 80 0 0 1 180 100 L 100 100 Z" 
                                    fill="#00d4aa"
                                    style={{
                                        transform: mounted ? 'scale(1)' : 'scale(0)',
                                        transformOrigin: '100px 100px',
                                        transition: 'transform 0.8s ease-out 0.3s'
                                    }}
                                />
                                <path 
                                    d="M 180 100 A 80 80 0 0 1 100 180 L 100 100 Z" 
                                    fill="#0066ff"
                                    style={{
                                        transform: mounted ? 'scale(1)' : 'scale(0)',
                                        transformOrigin: '100px 100px',
                                        transition: 'transform 0.8s ease-out 0.5s'
                                    }}
                                />
                                <path 
                                    d="M 100 180 A 80 80 0 0 1 20 100 L 100 100 Z" 
                                    fill="#1a1f35"
                                    style={{
                                        transform: mounted ? 'scale(1)' : 'scale(0)',
                                        transformOrigin: '100px 100px',
                                        transition: 'transform 0.8s ease-out 0.7s'
                                    }}
                                />
                                <circle cx="100" cy="100" r="50" fill="white"/>
                                <text x="100" y="105" textAnchor="middle" className="text-2xl font-bold fill-gray-900">2.8K</text>
                            </svg>
                        </div>
                        <div className="mt-4 space-y-2">
                            {pieChartData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Calendar & Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Calendar */}
                    <div className="lg:col-span-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Calendar</h3>
                            <div className="flex gap-2 items-center">
                                <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>
                                <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Month and Year Selectors */}
                        <div className="flex gap-2 mb-4">
                            <select 
                                value={currentMonth.getMonth()} 
                                onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#00d4aa] focus:outline-none"
                            >
                                {monthNames.map((month, idx) => (
                                    <option key={idx} value={idx}>{month}</option>
                                ))}
                            </select>
                            <select 
                                value={currentMonth.getFullYear()} 
                                onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-[#00d4aa] focus:outline-none"
                            >
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                                <div key={i} className="text-center text-xs font-semibold text-gray-500 py-1">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const today = new Date();
                                const isToday = day === today.getDate() && 
                                               currentMonth.getMonth() === today.getMonth() && 
                                               currentMonth.getFullYear() === today.getFullYear();
                                const hasAppointment = appointmentDates.includes(day);
                                const appointment = appointments[day.toString() as keyof typeof appointments];
                                return (
                                    <div key={day} className="relative group">
                                        <button
                                            onClick={() => setSelectedDate(day)}
                                            onMouseEnter={() => hasAppointment && setHoveredDate(day)}
                                            onMouseLeave={() => setHoveredDate(null)}
                                            className={`w-full aspect-square rounded-lg text-sm flex items-center justify-center transition-all relative ${
                                                isToday ? 'bg-[#00d4aa] text-white font-bold' :
                                                selectedDate === day ? 'bg-blue-100 text-blue-700 font-semibold' :
                                                'hover:bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {day}
                                            {hasAppointment && (
                                                <div className="absolute bottom-0.5 w-1 h-1 bg-orange-500 rounded-full"></div>
                                            )}
                                        </button>
                                        
                                        {/* Appointment Tooltip */}
                                        {hasAppointment && hoveredDate === day && appointment && (
                                            <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                                                <div className="font-semibold mb-1">{appointment.title}</div>
                                                <div className="text-gray-300">{appointment.patient}</div>
                                                <div className="text-gray-400 mt-1">{appointment.time}</div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivities.map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center font-bold text-sm`}>
                                        {activity.user.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-gray-900">{activity.user}</div>
                                        <div className="text-xs text-gray-600">{activity.action}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{activity.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="lg:col-span-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3 flex flex-col gap-px">
                            {quickActions.map((action, idx) => (
                                <Link key={idx} href={action.href}>
                                    <button className={`w-full ${action.color} text-white px-4 py-4 rounded-lg transition-colors flex items-center gap-3`}>
                                        {quickActionIcons[action.id]}
                                        <span className="font-medium">{action.label}</span>
                                    </button>
                                </Link>
                            ))}
                        </div>

                        {/* Dr. George Profile Section */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#00d4aa]">
                                    <Image 
                                        src="/dr-george.png" 
                                        alt="Dr. George" 
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Dr. George</div>
                                    <div className="text-sm text-gray-600">Pharmacist</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="text-lg font-bold text-gray-900">156</div>
                                    <div className="text-xs text-gray-600">Sessions</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <div className="text-lg font-bold text-gray-900">4.9</div>
                                    <div className="text-xs text-gray-600">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
