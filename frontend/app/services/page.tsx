export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 lg:py-28 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-sm font-medium">Telepharmacy Services</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Virtual Health{" "}
                            <span className="text-[#0066ff]">Consultations</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Professional pharmacy consultations from the comfort of your home. Get expert guidance on medications, supplements, and chronic disease management.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-lg transition-all duration-200">
                                View Services
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="h-12 px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Packages & Pricing */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Service Packages & <span className="text-[#0066ff]">Pricing</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Comprehensive care packages designed to meet your specific health needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                ),
                                title: "Virtual Medication Review",
                                price: "$75",
                                duration: "30 min",
                                description: "Comprehensive review of all current medications, identifying interactions, optimizing therapy, and addressing any medication concerns.",
                                features: [
                                    "Complete medication list review",
                                    "Drug interaction analysis",
                                    "Side effect evaluation",
                                    "Written action plan"
                                ]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Diabetes & Weight Loss Consultation",
                                price: "$145",
                                duration: "60 min",
                                description: "Personalized program focusing on diabetes management and sustainable weight loss through medication optimization and lifestyle coaching.",
                                features: [
                                    "Blood sugar monitoring plan",
                                    "Medication optimization",
                                    "Nutrition guidance",
                                    "Follow-up action items"
                                ]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    </svg>
                                ),
                                title: "Supplement Consultation",
                                price: "$75",
                                duration: "30 min",
                                description: "Expert guidance on dietary supplements, assessing safety and efficacy, identifying potential drug-supplement interactions.",
                                features: [
                                    "Supplement safety review",
                                    "Drug-supplement interactions",
                                    "Evidence-based recommendations",
                                    "Custom supplement plan"
                                ]
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Chronic Disease Management",
                                price: "$145",
                                duration: "60 min",
                                description: "Ongoing support for managing chronic conditions through medication optimization, lifestyle modifications, and personalized care strategies.",
                                features: [
                                    "Disease state assessment",
                                    "Treatment optimization",
                                    "Lifestyle modifications",
                                    "Long-term care strategy"
                                ]
                            }
                        ].map((service, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-[#0066ff] hover:shadow-xl transition-all duration-300 group">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#0066ff] to-[#00bfa6] rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                            <p className="text-sm text-gray-600">{service.duration}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-[#0066ff]">{service.price}</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                                                <circle cx="12" cy="12" r="10" fill="#E0F2FE" />
                                                <path d="M9 12l2 2 4-4" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button className="w-full h-12 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] transition-all duration-200 flex items-center justify-center gap-2">
                                    Book This Session
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How it Works
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Simple, convenient, and designed to fit easily into your lifestyle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                step: "1",
                                title: "Book Your Session",
                                description: "Choose your preferred date and time online"
                            },
                            {
                                step: "2",
                                title: "Complete Health Form",
                                description: "Fill out a brief health questionnaire"
                            },
                            {
                                step: "3",
                                title: "Virtual Consultation",
                                description: "Meet via secure video for your session"
                            },
                            {
                                step: "4",
                                title: "Receive Your Plan",
                                description: "Get personalized recommendations and action steps"
                            }
                        ].map((step, index) => (
                            <div key={index} className="text-center group">
                                {/* Number Circle */}
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-[#0066ff] flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {step.step}
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gray-300">
                                            <div className="h-full bg-[#0066ff] w-0 group-hover:w-full transition-all duration-500"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Book Your Consultation */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="max-w-2xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Book Your Consultation
                            </h2>
                            <p className="text-lg text-gray-600">
                                Select a date that works for you. We offer flexible scheduling to accommodate your needs.
                            </p>
                        </div>

                        {/* Scheduling Widget Card */}
                        <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200 text-center">
                            {/* Calendar Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 bg-[#E0F2FE] rounded-2xl flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Calendly Integration
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Schedule your consultation with our integrated booking system. Choose a time that works best for you.
                            </p>

                            {/* CTA Button */}
                            <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-lg transition-all duration-200">
                                View Scheduling Widget
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {/* Info Items */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Same-week availability</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span>45-60 min sessions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>24-hour cancellation policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-12 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                        Book your consultation today and take the first step toward optimized health and wellness.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button className="h-12 px-8 rounded-full bg-white text-[#0066ff] font-medium hover:bg-gray-100 hover:shadow-xl shadow-lg transition-all duration-200">
                            Schedule Consultation
                        </button>
                        <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
