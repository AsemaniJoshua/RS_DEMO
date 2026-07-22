import BlogDetailPublicClient from "./BlogDetailPublicClient";

export function generateStaticParams() {
    return [{ slug: "placeholder" }];
}

export default function BlogDetailPage() {
    return <BlogDetailPublicClient />;
}
