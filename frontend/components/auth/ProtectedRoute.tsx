"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                // Redirect to login if not authenticated
                router.push('/login');
            } else if (requireAdmin && !isAdmin()) {
                // Redirect to dashboard if not admin but trying to access admin routes
                router.push('/dashboard');
            }
        }
    }, [isAuthenticated, isLoading, isAdmin, requireAdmin, router]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!isAuthenticated) {
        return null;
    }

    // If admin required but user is not admin
    if (requireAdmin && !isAdmin()) {
        return null;
    }

    return <>{children}</>;
}
