import BrowseCourseDetailClient from "./BrowseCourseDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function CourseDetailPage() {
    return <BrowseCourseDetailClient />;
}
