"use client";

import { useState } from "react";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import bookingServicesData from "@/data/bookingServices.json";

export default function NewAppointmentPage() {
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notes: ""
    });

    // Service icons
    const serviceIcons = {
        "General Consultation": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        "Virtual Medication Review": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
        ),
        "Diabetes & Weight Loss Consultation": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2"/>
            </svg>
        ),
        "Health & Wellness Strategy Session": (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        )
    };

    const services = bookingServicesData.map(service => ({
        ...service,
        icon: serviceIcons[service.name as keyof typeof serviceIcons]
    }));

    const timeSlots = {
        morning: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"],
        afternoon: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"],
        evening: ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"]
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Booking submitted:", { selectedService, selectedDate, selectedTime, formData });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const selectedServiceData = selectedService !== null ? services[selectedService] : null;

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <BackButton href="/dashboard/appointments" label="Back" className="mb-0" />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Book New Appointment</h1>
                    <p className="text-gray-600">Schedule a consultation with Dr. George</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Booking Area (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Step 1: Select Service */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#0066ff] rounded-full flex items-center justify-center text-white font-bold">
                                    1
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Select Service (Optional)</h2>
                            </div>
                            {selectedService !== null && (
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="text-sm text-gray-600 hover:text-[#0066ff] underline cursor-pointer"
                                >
                                    Skip service selection
                                </button>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6">Choose a specific service or skip to book a general consultation.</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {services.map((service, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedService(index)}
                                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                        selectedService === index
                                            ? "border-[#0066ff] bg-[#E0F2FE]"
                                            : "border-gray-200 hover:border-[#0066ff]"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                                        selectedService === index ? "bg-[#0066ff] text-white" : "bg-gray-100 text-[#0066ff]"
                                    }`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        {service.duration}
                                    </div>
                                    <div className="text-2xl font-bold text-[#0066ff]">{service.price}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Select Date */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#0066ff] rounded-full flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Select Date</h2>
                        </div>

                        {/* Simple Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => {
                                const dayNum = i - 2; // Start from day 1
                                const dateValue = dayNum > 0 && dayNum <= 31 ? `2024-12-${String(dayNum).padStart(2, '0')}` : "";
                                const isAvailable = dayNum > 0 && dayNum <= 31 && dayNum > 14; // Days after 14th are available
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => isAvailable && setSelectedDate(dateValue)}
                                        disabled={!isAvailable}
                                        className={`h-10 rounded-lg text-sm font-medium transition-all ${
                                            selectedDate === dateValue
                                                ? "bg-[#0066ff] text-white"
                                                : isAvailable
                                                ? "bg-gray-50 text-gray-900 hover:bg-[#E0F2FE]"
                                                : "text-gray-300 cursor-not-allowed"
                                        }`}
                                    >
                                        {dayNum > 0 && dayNum <= 31 ? dayNum : ""}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 3: Select Time */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#0066ff] rounded-full flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Select Time</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Morning */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-3">Morning</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {timeSlots.morning.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`h-10 rounded-lg text-sm font-medium transition-all ${
                                                selectedTime === time
                                                    ? "bg-[#0066ff] text-white"
                                                    : "bg-gray-50 text-gray-900 hover:bg-[#E0F2FE]"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Afternoon */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-3">Afternoon</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {timeSlots.afternoon.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`h-10 rounded-lg text-sm font-medium transition-all ${
                                                selectedTime === time
                                                    ? "bg-[#0066ff] text-white"
                                                    : "bg-gray-50 text-gray-900 hover:bg-[#E0F2FE]"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Evening */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-3">Evening</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {timeSlots.evening.map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`h-10 rounded-lg text-sm font-medium transition-all ${
                                                selectedTime === time
                                                    ? "bg-[#0066ff] text-white"
                                                    : "bg-gray-50 text-gray-900 hover:bg-[#E0F2FE]"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Your Information */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#0066ff] rounded-full flex items-center justify-center text-white font-bold">
                                4
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none text-gray-900"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none text-gray-900"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none text-gray-900"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Requests / Notes (Optional)
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0066ff] focus:outline-none resize-none text-gray-900"
                                    placeholder="Any specific concerns or topics you'd like to discuss..."
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Booking Summary Sidebar (1/3) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white rounded-2xl p-6 border-2 border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

                        <div className="space-y-6">
                            {/* Service */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Service</p>
                                {selectedServiceData ? (
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium text-gray-900">{selectedServiceData.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{selectedServiceData.duration}</p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-[#E0F2FE] rounded-lg">
                                        <p className="font-medium text-[#0066ff]">General Consultation</p>
                                        <p className="text-sm text-gray-600 mt-1">Service will be determined during consultation</p>
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Date</p>
                                {selectedDate ? (
                                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-2">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <p className="font-medium text-gray-900">{selectedDate}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Not selected</p>
                                )}
                            </div>

                            {/* Time */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Time</p>
                                {selectedTime ? (
                                    <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-2">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0066ff]">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <p className="font-medium text-gray-900">{selectedTime}</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Not selected</p>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-medium text-gray-600">Total</span>
                                    <span className="text-3xl font-bold text-[#0066ff]">
                                        {selectedServiceData ? selectedServiceData.price : "TBD"}
                                    </span>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone}
                                    className="w-full h-12 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    Confirm Booking
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    You'll receive a confirmation email after booking
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
