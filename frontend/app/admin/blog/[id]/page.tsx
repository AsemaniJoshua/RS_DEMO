import BlogDetailsClient from "./BlogDetailsClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function BlogDetailsPage() {
    return <BlogDetailsClient />;
}
