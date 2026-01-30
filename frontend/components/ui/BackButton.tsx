"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href?: string;
    label?: string;
    className?: string;
}

export default function BackButton({ 
    href, 
    label = "Back", 
    className 
}: BackButtonProps) {
    const router = useRouter();

    if (href) {
        return (
            <Link
                href={href}
                className={cn(
                    "inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-[#0066ff] hover:border-[#0066ff]/20 transition-all duration-200 group mb-6",
                    className
                )}
            >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                {label}
            </Link>
        );
    }

    return (
        <button
            onClick={() => router.back()}
            className={cn(
                "inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:text-[#0066ff] hover:border-[#0066ff]/20 transition-all duration-200 group mb-6",
                className
            )}
        >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            {label}
        </button>
    );
}
