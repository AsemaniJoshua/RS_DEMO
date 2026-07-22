import EditBlogClient from "./EditBlogClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditBlogPage() {
    return <EditBlogClient />;
}
