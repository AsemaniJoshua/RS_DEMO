import EditCourseClient from "./EditCourseClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditCoursePage() {
    return <EditCourseClient />;
}
