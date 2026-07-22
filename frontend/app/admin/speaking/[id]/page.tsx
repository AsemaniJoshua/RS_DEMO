import SpeakingEventDetailClient from "./SpeakingEventDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function ViewSpeakingEventPage() {
    return <SpeakingEventDetailClient />;
}
