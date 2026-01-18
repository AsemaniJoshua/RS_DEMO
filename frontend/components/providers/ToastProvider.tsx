"use client";

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                // Default options
                duration: 3000,
                style: {
                    background: '#fff',
                    color: '#363636',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                // Success toast style
                success: {
                    duration: 3000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10b981',
                    },
                },
                // Error toast style
                error: {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444',
                    },
                },
            }}
        />
    );
}
