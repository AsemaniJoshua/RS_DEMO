"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PwaInstallPrompt() {
    const [isIos, setIsIos] = useState(false);
    const [showIosModal, setShowIosModal] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showAndroidBanner, setShowAndroidBanner] = useState(false);

    useEffect(() => {
        // Register Service Worker
        if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
            navigator.serviceWorker.register("/sw.js").catch((err) => {
                console.error("Service Worker registration failed:", err);
            });
        }

        // Check if already in standalone app mode
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (navigator as any).standalone === true;

        if (isStandalone) {
            return; // App is already installed and opened as PWA
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iosDevice = /iphone|ipad|ipod/.test(userAgent);

        if (iosDevice) {
            setIsIos(true);
            // Delay showing iOS modal slightly so page loads gracefully
            const timer = setTimeout(() => setShowIosModal(true), 1000);
            return () => clearTimeout(timer);
        }

        // Handle Android / Chrome beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowAndroidBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const dismissPrompt = () => {
        setShowIosModal(false);
        setShowAndroidBanner(false);
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            console.log("User accepted PWA installation");
        }
        setDeferredPrompt(null);
        setShowAndroidBanner(false);
    };

    return (
        <>
            {/* iOS Step-by-Step Installation Modal */}
            {isIos && showIosModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-800 text-gray-900 dark:text-white relative overflow-hidden">
                        
                        {/* Background Glow Accent */}
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#0066ff]/10 rounded-full blur-2xl"></div>

                        {/* Close button */}
                        <button
                            onClick={dismissPrompt}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 p-2 border border-slate-700 shadow-md shrink-0 flex items-center justify-center">
                                <Image
                                    src="/rx-logo.png"
                                    alt="Dr. George App Logo"
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-[#0066ff] uppercase tracking-wider">PWA App Installation</span>
                                <h3 className="text-xl font-bold leading-tight">Install Dr. George App</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Add to your iPhone / iPad home screen</p>
                            </div>
                        </div>

                        {/* Step-by-Step Instructions */}
                        <div className="space-y-4 mb-6">
                            {/* Step 1 */}
                            <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                                <div className="w-8 h-8 rounded-full bg-[#0066ff] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    1
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Tap the Share button
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        At the bottom of your Safari browser, tap the{" "}
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium">
                                            Share <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-1"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                                        </span> icon.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                                <div className="w-8 h-8 rounded-full bg-[#0066ff] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    2
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Select "Add to Home Screen"
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Scroll down the menu options and tap{" "}
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 font-medium">
                                            Add to Home Screen <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline ml-1"><path d="M12 5v14M5 12h14"/></svg>
                                        </span>.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                                <div className="w-8 h-8 rounded-full bg-[#0066ff] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    3
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Confirm & Enjoy
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        Tap <strong className="text-blue-600 dark:text-blue-400">Add</strong> in the top right corner to launch like a native mobile app!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={dismissPrompt}
                                className="w-full py-3.5 bg-gradient-to-r from-[#0066ff] to-[#00bfa6] text-white font-bold rounded-2xl hover:opacity-95 transition-opacity shadow-lg shadow-blue-500/20 cursor-pointer"
                            >
                                Got It!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Android / Chrome Desktop Install Banner */}
            {showAndroidBanner && (
                <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-md bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 p-1.5 border border-slate-700 shrink-0 flex items-center justify-center">
                            <Image
                                src="/rx-logo.png"
                                alt="App Icon"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">Install Dr. George App</h4>
                            <p className="text-xs text-gray-300">Fast, offline health & telepharmacy access</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={handleInstallClick}
                            className="px-4 py-2 bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                            Install
                        </button>
                        <button
                            onClick={dismissPrompt}
                            className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Dismiss"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
