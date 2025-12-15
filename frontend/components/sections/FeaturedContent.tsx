import Link from "next/link";

// Icons
const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
    </svg>
);

const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface ContentCard {
    icon: React.ReactNode;
    category: string;
    title: string;
    description: string;
    link: string;
}

export default function FeaturedContent() {
    const contentCards: ContentCard[] = [
        {
            icon: <PlayIcon />,
            category: "VIDEO",
            title: "Understanding Drug Interactions",
            description: "Learn how to avoid dangerous medication combinations",
            link: "/resources/drug-interactions"
        },
        {
            icon: <BookIcon />,
            category: "EBOOK",
            title: "The Complete Guide to Supplement Safety",
            description: "Your comprehensive resource for safe supplementation",
            link: "/resources/supplement-guide"
        },
        {
            icon: <CalendarIcon />,
            category: "APPOINTMENT",
            title: "Book a Consultation",
            description: "One-on-one virtual pharmacy consultation",
            link: "/book-appointment"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-[1400px] px-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Featured Content
                        </h2>
                        <p className="text-gray-600 max-w-xl">
                            Explore our latest videos, eBooks, and resources designed to empower your health decisions.
                        </p>
                    </div>
                    <Link
                        href="/resources"
                        className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#0066ff] text-[#0066ff] font-medium hover:bg-[#0066ff] hover:text-white transition-all duration-200"
                    >
                        View All Resources
                        <ArrowRightIcon />
                    </Link>
                </div>

                {/* Content Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contentCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border border-gray-100"
                        >
                            {/* Card Header with Icon */}
                            <div className="h-32 bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] flex items-center justify-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0066ff] group-hover:scale-110 transition-transform duration-300">
                                    {card.icon}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                {/* Category Badge */}
                                <span className="text-xs font-bold text-[#0066ff] tracking-wider mb-3 block">
                                    {card.category}
                                </span>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {card.description}
                                </p>

                                {/* Learn More Link */}
                                <Link
                                    href={card.link}
                                    className="inline-flex items-center gap-2 text-[#0066ff] font-medium hover:gap-3 transition-all duration-200"
                                >
                                    Learn More
                                    <ArrowRightIcon />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
