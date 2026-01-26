"use client";

interface DeleteSpeakingEventModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    eventTitle: string;
}

export default function DeleteSpeakingEventModal({
    isOpen,
    onCancel,
    onConfirm,
    eventTitle
}: DeleteSpeakingEventModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-red-600">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Delete Speaking Event?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-900">"{eventTitle}"</span>? This action cannot be undone.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Delete Event
                    </button>
                </div>
            </div>
        </div>
    );
}
