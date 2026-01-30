"use client";

import { useState, useEffect } from "react";
import { speakingService, SpeakingEvent } from "@/services/speaking-service";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Clock } from "lucide-react";

import BackButton from "@/components/ui/BackButton";

export default function SpeakingEventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<SpeakingEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (!event) return null;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <BackButton label="Back to Events" />

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="relative h-64 md:h-96 w-full bg-gray-100">
                    {event.image ? (
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Calendar className="w-20 h-20" />
                        </div>
                    )}
                    <div className="absolute top-6 right-6">
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/95 text-[#0066ff] shadow-sm">
                            {event.category || 'Event'}
                        </span>
                    </div>
                </div>

                <div className="p-6 md:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

                    <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0066ff]">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Time</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(event.date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">Location</p>
                                <p className="text-sm font-semibold text-gray-900">{event.venue}, {event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-600">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">About this Event</h3>
                        <p className="whitespace-pre-line leading-relaxed">
                            {event.description || "No description available for this event."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
