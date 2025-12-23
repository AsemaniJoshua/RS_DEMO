"use client";

interface DeleteCourseModalProps {
    isOpen: boolean;
    courseName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteCourseModal({ isOpen, courseName, onConfirm, onCancel }: DeleteCourseModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-600">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Delete Course?
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">"{courseName}"</span>? This action cannot be undone and all associated data will be permanently removed.
                </p>

                {/* Warning Box */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-600 flex-shrink-0 mt-0.5">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <div>
                            <div className="font-semibold text-red-900 text-sm mb-1">This will permanently:</div>
                            <ul className="text-sm text-red-700 space-y-1">
                                <li>• Remove course from student accounts</li>
                                <li>• Delete all course content and materials</li>
                                <li>• Remove enrollment data and progress</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Delete Course
                    </button>
                </div>
            </div>
        </div>
    );
}
