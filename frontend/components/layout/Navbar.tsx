"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import navItems from "@/data/navigation.json";
import MobileMenu from "@/components/layout/MobileMenu";

// Simple Calendar Icon SVG for the Book Appointment button
const CalendarIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// Phone Icon SVG for the Contact link
const PhoneIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

import { usePathname } from "next/navigation";

// ... existing imports

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
            <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-3 sm:px-6 lg:px-12">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <Logo />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative py-6 text-[15px] font-medium transition-colors ${isActive
                                    ? "text-[#0052cc] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#0052cc]"
                                    : "text-gray-600 hover:text-[#0052cc]"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Section: Contact & CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/contact"
                        className="flex items-center gap-1.5 text-[15px] font-medium text-gray-600 transition-colors hover:text-[#0052cc]"
                    >
                        <PhoneIcon />
                        Contact
                    </Link>
                    <Link href="/booking">
                        <Button icon={<CalendarIcon />} size="md">
                            Book Appointment
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu */}
                <MobileMenu />
            </div>
        </header>
    );
}
