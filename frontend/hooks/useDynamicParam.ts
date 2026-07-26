import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * Custom hook to safely retrieve dynamic route parameters in Next.js static exports (`output: 'export'`).
 *
 * When static export generates `placeholder.html`, `useParams()` returns `"placeholder"`.
 * This hook extracts the true dynamic ID from `window.location.pathname`.
 */
export function useDynamicParam(paramKey: string = "id"): string {
    const params = useParams();
    const rawParam = params?.[paramKey] as string;
    
    const getResolvedId = (): string => {
        if (typeof window !== "undefined") {
            const pathSegments = window.location.pathname.split("/").filter(Boolean);

            // Handle edit routes e.g. /admin/appointments/[id]/edit
            if (pathSegments.includes("edit")) {
                const editIndex = pathSegments.indexOf("edit");
                if (editIndex > 0 && pathSegments[editIndex - 1] !== "placeholder") {
                    return pathSegments[editIndex - 1];
                }
            }

            // Handle detail routes e.g. /admin/appointments/[id]
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment && lastSegment !== "placeholder" && lastSegment !== "edit") {
                return lastSegment;
            }
        }
        return rawParam !== "placeholder" ? (rawParam || "") : "";
    };

    const [resolvedId, setResolvedId] = useState<string>(getResolvedId);

    useEffect(() => {
        const idFromPath = getResolvedId();
        if (idFromPath) {
            setResolvedId(idFromPath);
        }
    }, [rawParam]);

    return resolvedId || (rawParam !== "placeholder" ? rawParam : "");
}
