import { Suspense } from "react";
import EbookStoreDetailClient from "./EbookStoreDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EbookDetailPage() {
    return (
        <Suspense fallback={
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#00d4aa] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading ebook details...</p>
                </div>
            </div>
        }>
            <EbookStoreDetailClient />
        </Suspense>
    );
}
