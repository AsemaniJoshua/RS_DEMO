// Service card icons
const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UsersIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BookOpenIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface Service {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function Services() {
    const services: Service[] = [
        {
            icon: <ShieldIcon />,
            title: "Medication Guidance",
            description: "Professional guidance to help you understand your medicines, use them safely and identify potential medication-related concerns."
        },
        {
            icon: <HeartIcon />,
            title: "Health & Disease Education",
            description: "Clear, practical information on common health conditions, prevention and healthier everyday choices."
        },
        {
            icon: <UsersIcon />,
            title: "Pharmacist Consultation",
            description: "Personalized pharmacist consultations to discuss medication use, medication-related concerns and other appropriate pharmaceutical care needs."
        },
        {
            icon: <BookOpenIcon />,
            title: "Health Resources",
            description: "Evidence-informed articles, videos and educational resources designed to make important health information easier to understand."
        }
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        How RxWithDrGeorge{" "}
                        <span className="text-[#0066ff]">Can Help</span>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        From professional pharmaceutical support to practical health education, RxWithDrGeorge helps you understand your medicines, navigate health information and make better-informed health decisions.
                    </p>
                </div>

                {/* Service Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 bg-[#0066ff] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {service.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
