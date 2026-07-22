import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type?: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { id } = await params;
    const search = searchParams ? await searchParams : {};
    const type = search?.type;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    
    let product = null;
    try {
        if (type === 'eBook') {
            const res = await fetch(`${apiUrl}/public/ebooks/${id}`, { next: { revalidate: 3600 } });
            if (res.ok) {
                const json = await res.json();
                product = json.data?.ebook || json.data || json;
            }
        } else if (type === 'Course') {
            const res = await fetch(`${apiUrl}/public/courses/${id}`, { next: { revalidate: 3600 } });
            if (res.ok) {
                const json = await res.json();
                product = json.data || json;
            }
        }
    } catch (err) {
        console.error("Failed to fetch product metadata:", err);
    }

    if (!product) {
        return {
            title: "Product Not Found | Dr. George",
            description: "The requested product details could not be found."
        };
    }

    const title = product.title;
    const cleanDescription = product.description?.replace(/<[^>]*>/g, '').slice(0, 160) || 'Check out our products from Dr. George.';
    const image = product.coverImage || product.thumbnailUrl || '';

    return {
        title: `${title} | Dr. George`,
        description: cleanDescription,
        openGraph: {
            title: title,
            description: cleanDescription,
            type: "website",
            url: `https://drgeorgehealth.com/products/${id}?type=${type || 'eBook'}`,
            images: image ? [{ url: image, alt: title }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: cleanDescription,
            images: image ? [image] : []
        }
    };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
