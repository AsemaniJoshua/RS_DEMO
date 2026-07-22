import MyLibraryEbookDetailClient from "./MyLibraryEbookDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function MyLibraryEbookDetailsPage() {
    return <MyLibraryEbookDetailClient />;
}
