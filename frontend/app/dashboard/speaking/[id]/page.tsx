import DashboardSpeakingDetailClient from "./DashboardSpeakingDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function SpeakingEventDetailsPage() {
    return <DashboardSpeakingDetailClient />;
}
