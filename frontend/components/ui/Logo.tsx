import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 group">
            {/* Rx Icon Container */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#0052cc] to-[#0052cc] shadow-sm transition-transform duration-300 group-hover:scale-105">
                <span className="text-lg font-bold text-white">Rx</span>
            </div>

            {/* Text Logo */}
            <div className="flex items-baseline text-lg font-bold tracking-tight">
                <span className="text-gray-900">RxWith</span><span className="text-[#0052cc]">DrGeorge</span>
            </div>
        </Link>
    );
}
