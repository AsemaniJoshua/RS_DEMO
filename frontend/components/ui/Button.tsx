import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost";
    size?: "sm" | "md" | "lg";
    icon?: ReactNode;
    children: ReactNode;
    className?: string; // allow overriding classes
}

export default function Button({
    variant = "primary",
    size = "md",
    icon,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
        primary: "bg-[#0052cc] text-white hover:bg-blue-700 hover:shadow-md focus:ring-[#0052cc]",
        ghost: "text-[var(--nav-text)] hover:text-[var(--brand-blue)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",
    };

    const sizes = {
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-5 text-[15px]",
        lg: "h-12 px-8 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
}
