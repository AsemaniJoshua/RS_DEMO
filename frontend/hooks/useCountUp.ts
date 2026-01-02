import { useEffect, useState } from 'react';

interface UseCountUpOptions {
    end: number;
    duration?: number;
    start?: number;
    trigger?: boolean;
}

export function useCountUp({ end, duration = 2000, start = 0, trigger = true }: UseCountUpOptions) {
    const [count, setCount] = useState(start);

    useEffect(() => {
        // Reset to start when trigger becomes false
        if (!trigger) {
            setCount(start);
            return;
        }

        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = (t: number) => t * (2 - t);
            const easedProgress = easeOutQuad(progress);
            
            setCount(Math.floor(easedProgress * (end - start) + start));

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            }
        };

        animationFrameId = window.requestAnimationFrame(step);

        return () => {
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, [end, start, duration, trigger]);

    return count;
}
