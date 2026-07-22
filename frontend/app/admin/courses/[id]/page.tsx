import CourseDetailsClient from "./CourseDetailsClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function CourseDetailsPage() {
    return <CourseDetailsClient />;
}
