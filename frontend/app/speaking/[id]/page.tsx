import SpeakingDetailPublicClient from "./SpeakingDetailPublicClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function SpeakingDetailPage() {
    return <SpeakingDetailPublicClient />;
}
