import DashboardMediaDetailClient from "./DashboardMediaDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function MediaDetailPage() {
    return <DashboardMediaDetailClient />;
}
