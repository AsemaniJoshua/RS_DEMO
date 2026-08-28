import Link from "next/link";

export default function WhyChoose() {
    const points = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Pharmaceutical Expertise",
            description: "Health information and pharmaceutical guidance grounded in professional pharmacy training and practice."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Evidence-Informed Communication",
            description: "Complex health information translated into clear, practical messages while remaining grounded in credible scientific evidence."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Accessible Health Education",
            description: "Health education designed to meet people where they are — through digital platforms, media, community engagement and meaningful conversations."
        },
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Proven Public Engagement",
            description: "A growing record of health advocacy, public education, media engagement and collaborations that bring important health conversations closer to communities."
        }
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                <div className="max-w-4xl mx-auto text-left">
                    {/* Header */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Why <span className="text-[#0066ff]">RxWithDrGeorge?</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-3xl">
                        Built on pharmaceutical expertise, responsible health communication and a commitment to making reliable health information easier to understand and use.
                    </p>

                    {/* 4 Points Grid */}
                    <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-12">
                        {points.map((item, index) => (
                            <div key={index} className="flex gap-4 group p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#E0F2FE] text-[#0066ff] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1.5 text-lg">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                        <Link 
                            href="/about" 
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#0066ff] to-[#00ccff] hover:from-[#0052cc] hover:to-[#00b8e6] text-white font-semibold text-base sm:text-lg shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all duration-300 group"
                        >
                            <span>Learn More About Dr George</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform duration-200">
                                <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
