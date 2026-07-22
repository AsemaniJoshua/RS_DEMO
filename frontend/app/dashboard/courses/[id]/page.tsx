import MyCourseDetailClient from "./MyCourseDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function CourseDetailPage() {
    return <MyCourseDetailClient />;
}
