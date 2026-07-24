import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.rxwithdrgeorge.com/api/v1';
    
    let blog = null;
    try {
        // Try slug lookup first
        const res = await fetch(`${apiUrl}/public/blog/slug/${slug}`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const json = await res.json();
            blog = json.data?.blog || json.data;
        } else {
            // Try ID lookup fallback for backwards compatibility
            const resFallback = await fetch(`${apiUrl}/public/blog/${slug}`, { next: { revalidate: 3600 } });
            if (resFallback.ok) {
                const jsonFallback = await resFallback.json();
                blog = jsonFallback.data?.blog || jsonFallback.data;
            }
        }
    } catch (err) {
        console.error("Failed to fetch blog metadata:", err);
    }

    if (!blog) {
        return {
            title: "Article Not Found | Dr. George",
            description: "The requested health article could not be found."
        };
    }

    const title = blog.title;
    const cleanExcerpt = blog.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || '';
    const image = blog.featured_image || '';
    const canonicalUrl = `https://drgeorgehealth.com/blog/${blog.slug || slug}`;

    return {
        title: `${title} | Dr. George`,
        description: cleanExcerpt,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: title,
            description: cleanExcerpt,
            type: "article",
            url: canonicalUrl,
            images: image ? [{ url: image, alt: title }] : [],
            publishedTime: blog.published_at,
            authors: [`${blog.author?.first_name || ''} ${blog.author?.last_name || ''}`.trim() || 'Dr. George']
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: cleanExcerpt,
            images: image ? [image] : []
        }
    };
}

export default function BlogLayout({ children }: Props) {
    return <>{children}</>;
}
