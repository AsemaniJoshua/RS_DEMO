import EbookDetailClient from "./EbookDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EbookDetailPage() {
    return <EbookDetailClient />;
}
