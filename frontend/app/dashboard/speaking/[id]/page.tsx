"use client";

import { useState, useEffect } from "react";
import { speakingService, SpeakingEvent } from "@/services/speaking-service";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Clock, Tag, Globe, Info, ImageIcon } from "lucide-react";

export default function SpeakingEventDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<SpeakingEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await speakingService.getSpeakingEventById(id as string);
                if (!data) throw new Error('Event not found');
                setEvent(data);
            } catch (error) {
                router.push('/dashboard/speaking');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchEvent();
    }, [id, router]);

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UPCOMING': return 'bg-green-50 text-green-700 border-green-100';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link 
                    href="/dashboard/speaking"
                    className="inline-flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>

            {/* Hero Banner (Image) */}
            {event.image ? (
                <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="relative h-64 md:h-[400px] w-full">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm font-medium">No event image provided</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
                                <p className="text-gray-500 text-lg">{event.venue}</p>
                            </div>
                            {event.status && (
                                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(event.status)}`}>
                                    {event.status}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Date</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {new Date(event.date).toLocaleDateString(undefined, { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-purple-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Time</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {new Date(event.date).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl md:col-span-2">
                                <div className="p-3 bg-white rounded-lg shadow-sm text-green-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-medium mb-1">Location</div>
                                    <div className="font-bold text-gray-900 text-lg">
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Info className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">About This Event</h3>
                        </div>
                        
                        {event.description ? (
                            <div className="prose prose-sm prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {event.description}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No description provided.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Event Info</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Category
                                </label>
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-[#00d4aa]" />
                                    <span className="font-medium text-gray-900">{event.category || 'Uncategorized'}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Venue
                                </label>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-gray-900">{event.venue}</span>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                                    Event Date
                                </label>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-900 font-medium">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
