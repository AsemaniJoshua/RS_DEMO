import MediaDetailPublicClient from "./MediaDetailPublicClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function MediaDetailPage() {
    return <MediaDetailPublicClient />;
}
