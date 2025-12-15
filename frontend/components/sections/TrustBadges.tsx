export default function TrustBadges() {
    return (
        <section className="py-16 bg-white border-b border-gray-100">
            <div className="mx-auto max-w-[1400px] px-12">
                <div className="text-center mb-12">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Trusted & Certified</p>
                    <h3 className="text-2xl font-bold text-gray-900">Professional Affiliations & Certifications</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        {
                            name: "APhA",
                            fullName: "American Pharmacists Association",
                            description: "Active Member"
                        },
                        {
                            name: "ACCP",
                            fullName: "American College of Clinical Pharmacy",
                            description: "Fellow (FCCP)"
                        },
                        {
                            name: "NCPA",
                            fullName: "National Community Pharmacists",
                            description: "Advisory Board"
                        },
                        {
                            name: "BPS",
                            fullName: "Board of Pharmacy Specialties",
                            description: "Board Certified"
                        }
                    ].map((badge, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-[#0066ff] hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Badge Circle */}
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">{badge.name}</span>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h4 className="text-sm font-bold text-gray-900 mb-1">{badge.fullName}</h4>
                                <p className="text-xs text-gray-600">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Trust Element */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">Verified Credentials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">15+ Years Experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium">10,000+ Patients Served</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
