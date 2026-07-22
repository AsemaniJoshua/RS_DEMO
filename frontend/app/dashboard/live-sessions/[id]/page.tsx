import DashboardLiveSessionDetailClient from "./DashboardLiveSessionDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function LiveSessionDetailsPage() {
    return <DashboardLiveSessionDetailClient />;
}
