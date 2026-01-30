"use client";

import { useState, useEffect } from "react";
import { speakingService, SpeakingEvent } from "@/services/speaking-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Search } from "lucide-react";

export default function SpeakingEventsPage() {
    const [events, setEvents] = useState<SpeakingEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await speakingService.getSpeakingEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch speaking events", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Speaking Sessions</h1>
                <p className="text-gray-600">Upcoming speaking engagements and events.</p>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] text-gray-900 bg-white"
                    />
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <Link
                        key={event.id}
                        href={`/dashboard/speaking/${event.id}`}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                        <div className="relative h-48 w-full bg-gray-100">
                            {event.image ? (
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Calendar className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#0066ff]`}>
                                    {event.category || 'Event'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0066ff] transition-colors">
                                {event.title}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="shrink-0 w-4 h-4" />
                                    <span>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="shrink-0 w-4 h-4" />
                                    <span className="line-clamp-1">{event.venue}, {event.location}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {filteredEvents.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                        <p className="text-gray-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
