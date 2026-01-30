"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DeleteModal from "@/components/dashboard/DeleteModal";

// Mock Data
const MEDIA_ITEMS = [
    {
        id: "1",
        title: "Understanding Gut Health",
        type: "Video",
        duration: "15:30",
        date: "Sep 10, 2025",
        description: "A comprehensive video guide on improving your gut health naturally.",
        fileSize: "250 MB",
        format: "MP4"
    },
    // ...
];

export default function MediaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Mock fetch
    const item = MEDIA_ITEMS.find(m => m.id === params.id) || MEDIA_ITEMS[0];

    const handleDelete = () => {
        console.log("Deleting media:", item.id);
        setIsDeleteModalOpen(false);
        router.push("/dashboard/media");
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
             <div className="mb-6">
                <Link href="/dashboard/media" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Back to Library
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                 {/* Media Preview / Player Placeholder */}
                <div className="w-full md:w-1/2 bg-gray-900 text-white min-h-[300px] flex items-center justify-center p-6">
                     <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </div>
                        <p className="text-sm font-medium opacity-80">Preview not available (Mock)</p>
                     </div>
                </div>

                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                         <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            item.type === 'Video' ? 'bg-red-100 text-red-600' :
                            item.type === 'Audio' ? 'bg-purple-100 text-purple-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                            {item.type}
                        </span>
                        <span className="text-xs text-gray-500">{item.duration}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h1>
                    <p className="text-gray-600 mb-6 flex-1">
                        {item.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-8 border-t border-b border-gray-100 py-4">
                        <div>
                            <span className="block text-gray-400 text-xs">Uploaded</span>
                            {item.date}
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs">Size</span>
                            {item.fileSize}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button className="flex-1 bg-[#0066ff] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0052cc] transition-colors">
                            Download
                        </button>
                        <button 
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Remove Media"
                message="Are you sure you want to remove this item from your library?"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
