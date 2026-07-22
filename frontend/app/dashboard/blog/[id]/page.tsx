import DashboardBlogDetailClient from "./DashboardBlogDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function BlogDetailsPage() {
    return <DashboardBlogDetailClient />;
}
