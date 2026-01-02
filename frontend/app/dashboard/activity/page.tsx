"use client";

import userData from "@/data/dashboard/user-profile.json";

export default function ActivityPage() {
    const { recentActivity } = userData;

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'check':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                );
            case 'book':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            case 'calendar':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            case 'bookmark':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            case 'award':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    const getIconColor = (icon: string) => {
        switch (icon) {
            case 'check':
                return 'bg-green-100 text-green-600';
            case 'book':
                return 'bg-blue-100 text-blue-600';
            case 'calendar':
                return 'bg-purple-100 text-purple-600';
            case 'bookmark':
                return 'bg-yellow-100 text-yellow-600';
            case 'award':
                return 'bg-teal-100 text-teal-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Activity History</h1>
                <p className="text-gray-600">Track all your actions and progress</p>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Activity Items */}
                    <div className="space-y-6">
                        {recentActivity.map((activity, index) => (
                            <div key={activity.id} className="relative flex gap-4">
                                {/* Icon */}
                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(activity.icon)}`}>
                                    {getIcon(activity.icon)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                        <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                                        {activity.course && (
                                            <p className="text-sm text-gray-600 mb-2">{activity.course}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            {new Date(activity.date).toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Load More Activity
                    </button>
                </div>
            </div>
        </div>
    );
}
