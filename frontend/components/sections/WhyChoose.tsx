export default function WhyChoose() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="mx-auto max-w-[1400px] px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Why Choose <span className="text-[#0066ff]">Dr. George</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            With over 15 years of clinical experience and a passion for patient education, Dr. George brings a unique blend of expertise and accessibility to healthcare.
                        </p>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ),
                                    title: "Evidence-Based Approach",
                                    description: "Every recommendation is backed by the latest clinical research and scientific evidence"
                                },
                                {
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ),
                                    title: "Patient-Centered Care",
                                    description: "Personalized guidance tailored to your unique health needs and circumstances"
                                },
                                {
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ),
                                    title: "Accessible Anytime",
                                    description: "Virtual consultations available worldwide, making expert care convenient"
                                },
                                {
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ),
                                    title: "Proven Track Record",
                                    description: "Over 10,000 patients served with consistently positive outcomes"
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0066ff] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Stats */}
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            {
                                value: "15+",
                                label: "Years of Experience",
                                gradient: "from-[#0066ff] to-[#0052cc]"
                            },
                            {
                                value: "10K+",
                                label: "Patients Helped",
                                gradient: "from-[#0066ff] to-[#00acac]"
                            },
                            {
                                value: "500+",
                                label: "Speaking Events",
                                gradient: "from-[#00acac] to-[#00bfa6]"
                            },
                            {
                                value: "98%",
                                label: "Satisfaction Rate",
                                gradient: "from-[#00bfa6] to-[#2dd4bf]"
                            }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-center">
                                <div className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
