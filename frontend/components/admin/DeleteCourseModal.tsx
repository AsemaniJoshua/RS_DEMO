"use client";

interface DeleteCourseModalProps {
    isOpen: boolean;
    courseName: string;
    userRole?: string;
    isDeleting?: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteCourseModal({ isOpen, courseName, userRole, isDeleting = false, error, onConfirm, onCancel }: DeleteCourseModalProps) {
    if (!isOpen) return null;

    // Determine warning based on role
    const getWarningContent = () => {
        if (!userRole) {
            // Default for courses
            return {
                title: "Delete Course?",
                items: [
                    "Remove course from student accounts",
                    "Delete all course content and materials",
                    "Remove enrollment data and progress"
                ]
            };
        }

        // User deletion warnings based on role
        switch (userRole) {
            case "ADMIN":
                return {
                    title: "Delete Administrator?",
                    items: [
                        "⚠️ Remove admin access and permissions",
                        "⚠️ Delete all admin activity history",
                        "⚠️ This may affect system management"
                    ]
                };
            case "EDITOR":
                return {
                    title: "Delete Editor?",
                    items: [
                        "Remove editor permissions",
                        "Delete all created/edited content",
                        "Remove content management access"
                    ]
                };
            case "PATIENT":
            default:
                return {
                    title: "Delete Patient?",
                    items: [
                        "Remove patient account",
                        "Delete medical records and history",
                        "Remove appointment data"
                    ]
                };
        }
    };

    const warning = getWarningContent();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 backdrop-blur-sm"
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
                    {warning.title}
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">"{courseName}"</span>? This action cannot be undone and all associated data will be permanently removed.
                </p>

                {/* Warning Box */}
                <div className={`border rounded-lg p-4 mb-6 ${userRole === 'ADMIN' ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`flex-shrink-0 mt-0.5 ${userRole === 'ADMIN' ? 'text-red-700' : 'text-red-600'}`}>
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <div>
                            <div className={`font-semibold text-sm mb-1 ${userRole === 'ADMIN' ? 'text-red-900' : 'text-red-900'}`}>
                                This will permanently:
                            </div>
                            <ul className={`text-sm space-y-1 ${userRole === 'ADMIN' ? 'text-red-800' : 'text-red-700'}`}>
                                {warning.items.map((item, idx) => (
                                    <li key={idx}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Deleting...
                            </>
                        ) : (
                            <>
                                {error ? 'Retry Delete' : (userRole ? `Delete ${userRole === 'ADMIN' ? 'Admin' : userRole === 'EDITOR' ? 'Editor' : 'User'}` : 'Delete Course')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
