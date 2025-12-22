import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Dr. George - Pharmacist & Health Educator",
  description: "Meet Dr. George, a passionate pharmacist with 15+ years of clinical experience dedicated to empowering individuals with evidence-based health guidance and education.",
  openGraph: {
    title: "About Dr. George - Pharmacist & Health Educator",
    description: "Learn about Dr. George's mission to bridge the gap between complex medical information and practical health guidance",
    type: "profile"
  }
};

const UserCheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="17 11 19 13 23 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] text-[#0066ff] mb-6">
                                <UserCheckIcon />
                                <span className="text-sm font-medium">Healthcare Professional</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                Meet{" "}
                                <span className="text-[#0066ff]">Dr. George</span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                A passionate pharmacist and health educator dedicated to empowering individuals with the knowledge they need to make informed health decisions. With over 15 years of clinical experience, Dr. George bridges the gap between complex medical information and practical health guidance.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Link href="/booking">
                                    <button className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-lg transition-all duration-200 cursor-pointer">
                                        Book Consultation
                                        <ArrowRightIcon />
                                    </button>
                                </Link>
                                <Link href="/speaking">
                                    <button className="h-12 px-8 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200 cursor-pointer">
                                        Speaking Inquiries
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/dr-george.png"
                                    alt="Dr. George - Healthcare Professional"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise Section */}
            <section className="py-20 bg-gradient-to-br from-[#0052cc] via-[#0066ff] to-[#00bfa6]">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Areas of Expertise
                        </h2>
                        <p className="text-lg text-white/90 max-w-2xl mx-auto">
                            Specialized knowledge and experience across multiple healthcare domains
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                                    </svg>
                                ),
                                title: "Clinical Pharmacy",
                                description: "Comprehensive medication therapy management and drug safety expertise"
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Health Education",
                                description: "Evidence-based wellness programs and patient education initiatives"
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
                                        <path d="M18 14l-3-3-2 2-3-3-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Telepharmacy",
                                description: "Virtual consultation services for medication reviews and health optimization"
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Disease Prevention",
                                description: "Proactive strategies for chronic disease prevention and health promotion"
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Drug Interactions",
                                description: "Expert analysis of medication combinations and adverse drug reactions"
                            },
                            {
                                icon: (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 1a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3 3 3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 7v10M5 13l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Public Speaking",
                                description: "Engaging presentations on health topics for diverse audiences"
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-white/80 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Journey */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Professional Journey
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Key milestones shaping a career dedicated to health excellence.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200"></div>

                            <div className="space-y-8">
                                {[
                                    {
                                        year: "2006",
                                        title: "Pharma Graduation",
                                        description: "Specialized training in community health, specialty pharmacy, clinical"
                                    },
                                    {
                                        year: "2010",
                                        title: "Clinical Specialization",
                                        description: "Advanced certification in pharmacotherapy"
                                    },
                                    {
                                        year: "2014",
                                        title: "Telepharmacy Pioneer",
                                        description: "Expanding virtual consultations lab scale"
                                    },
                                    {
                                        year: "2018",
                                        title: "Health Education Platform",
                                        description: "Platform for informed health choices"
                                    },
                                    {
                                        year: "2022",
                                        title: "National Recognition",
                                        description: "Prominent presence at major health conferences"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="relative pl-16 group">
                                        {/* Timeline Dot */}
                                        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#0066ff] to-[#00bfa6] border-4 border-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-white text-sm font-bold">{index + 1}</span>
                                        </div>

                                        {/* Content Card */}
                                        <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
                                            <div className="flex items-baseline justify-between mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                                                <span className="text-sm text-[#0066ff] font-semibold">{item.year}</span>
                                            </div>
                                            <p className="text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Affiliations */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Professional <span className="text-[#0066ff]">Affiliations</span>
                    </h2>
                    <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-16">
                        Active member and leader in leading healthcare organizations
                    </p>

                    <div className="space-y-6">
                        {[
                            {
                                org: "American Pharmacists Association",
                                role: "Active Member",
                                badge: "APhA",
                                gradient: "from-[#0066ff] to-[#0052cc]",
                                description: "Leading organization for pharmacists nationwide"
                            },
                            {
                                org: "American College of Clinical Pharmacy",
                                role: "Fellow (FCCP)",
                                badge: "ACCP",
                                gradient: "from-[#0066ff] to-[#00acac]",
                                description: "Premier professional society for clinical pharmacists"
                            },
                            {
                                org: "National Community Pharmacists Association",
                                role: "Advisory Board Member",
                                badge: "NCPA",
                                gradient: "from-[#00acac] to-[#00bfa6]",
                                description: "Advocates for community pharmacy practice"
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <div className="flex items-center gap-8">
                                    {/* Badge */}
                                    <div className={`flex-shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                        <span className="text-2xl font-bold text-white">{item.badge}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.org}</h3>
                                        <p className="text-gray-600 mb-3">{item.description}</p>
                                        <span className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${item.gradient} text-white text-sm font-medium`}>
                                            {item.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 bg-white">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Mission & Values
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Guided by a commitment to improving lives through accessible, evidence-based health education.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Patient-Centered Care",
                                description: "Every recommendation is tailored to individual needs and circumstances."
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Evidence-Based Practice",
                                description: "All guidance is grounded in the latest scientific research and clinical evidence."
                            },
                            {
                                icon: (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ),
                                title: "Community Impact",
                                description: "Committed to improving public health through education and accessibility."
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                                {/* Icon */}
                                <div className="w-16 h-16 bg-[#E0F2FE] rounded-2xl flex items-center justify-center text-[#0066ff] mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {value.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Credentials & Stats */}
            <section className="py-20 bg-gray-50">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left: Credentials */}
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Professional Credentials
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Backed by extensive education, certifications, and real-world clinical experience.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Doctor of Pharmacy (PharmD)",
                                    "Board Certified Pharmacotherapy Specialist",
                                    "Certified Diabetes Care and Education Specialist",
                                    "Licensed Clinical Pharmacist",
                                    "Public Health Educator"
                                ].map((credential, index) => (
                                    <div key={index} className="flex items-start gap-3 group">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00bfa6] flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-200">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-900 font-medium">{credential}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Achievement Stats */}
                        <div>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        value: "Top 5%",
                                        label: "Academic Excellence",
                                        gradient: "from-[#0066ff] to-[#0052cc]"
                                    },
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        value: "10,000+",
                                        label: "Patients Served",
                                        gradient: "from-[#0066ff] to-[#00acac]"
                                    },
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 1a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3 3 3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" />
                                                <path d="M19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m7-4v10m-7-3l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ),
                                        value: "500+",
                                        label: "Speaking Events",
                                        gradient: "from-[#00acac] to-[#00bfa6]"
                                    },
                                    {
                                        icon: (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        ),
                                        value: "50+",
                                        label: "Publications",
                                        gradient: "from-[#00bfa6] to-[#2dd4bf]"
                                    }
                                ].map((stat, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {stat.icon}
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Let's Work Together CTA */}
            <section className="py-20 bg-[#1a1f35]">
                <div className="mx-auto max-w-[1400px] px-12">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Let's Work Together
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                            Whether you need a consultation, speaking engagement, or health education partnership, I'm here to help.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link href="/booking">
                            <button className="h-12 px-8 rounded-full bg-[#0066ff] text-white font-medium hover:bg-[#0052cc] hover:shadow-xl shadow-lg transition-all duration-200 cursor-pointer">
                                Start Your Journey
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="h-12 px-8 rounded-full border-2 border-white text-white font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                Contact Me
                            </button>
                        </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
