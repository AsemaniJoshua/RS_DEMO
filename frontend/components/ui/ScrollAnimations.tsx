'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollAnimations({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
        );

        const scanAndObserve = () => {
            const elements = document.querySelectorAll(
                '.fade-in, .slide-up, .slide-in-left, .slide-in-right, .scale-in, .stagger-children'
            );
            elements.forEach((el) => {
                if (el.classList.contains('animate-in')) return;
                
                const rect = el.getBoundingClientRect();
                if (rect.top <= window.innerHeight + 100) {
                    el.classList.add('animate-in');
                } else {
                    observer.observe(el);
                }
            });
        };

        // Scan immediately
        scanAndObserve();

        // Observe DOM mutations for async data loading
        const mutationObserver = new MutationObserver(() => {
            scanAndObserve();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Safety fallback timer to guarantee no section remains hidden or blank
        const fallbackTimer = setTimeout(() => {
            const hiddenElements = document.querySelectorAll(
                '.fade-in:not(.animate-in), .slide-up:not(.animate-in), .slide-in-left:not(.animate-in), .slide-in-right:not(.animate-in), .scale-in:not(.animate-in), .stagger-children:not(.animate-in)'
            );
            hiddenElements.forEach((el) => el.classList.add('animate-in'));
        }, 800);

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            clearTimeout(fallbackTimer);
        };
    }, [pathname]);

    return <>{children}</>;
}
