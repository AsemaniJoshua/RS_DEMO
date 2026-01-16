import Link from "next/link";
import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 ${className}`}>
            <div className="relative w-96 h-40">
                <Image 
                    src="/rx-logo.png" 
                    alt="RxWithDrGeorge" 
                    fill
                    className="object-contain object-left"
                    priority
                />
            </div>
        </Link>
    );
}
