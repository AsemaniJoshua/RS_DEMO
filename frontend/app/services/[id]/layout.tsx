import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    
    let service = null;
    try {
        const res = await fetch(`${apiUrl}/public/courses/${id}`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const json = await res.json();
            service = json.data || json;
        }
    } catch (err) {
        console.error("Failed to fetch service metadata:", err);
    }

    if (!service) {
        return {
            title: "Service Not Found | Dr. George",
            description: "The requested service details could not be found."
        };
    }

    const title = service.title;
    const cleanDescription = service.description?.replace(/<[^>]*>/g, '').slice(0, 160) || 'Discover our professional courses and services by Dr. George.';
    const image = service.thumbnailUrl || '';

    return {
        title: `${title} | Dr. George`,
        description: cleanDescription,
        openGraph: {
            title: title,
            description: cleanDescription,
            type: "website",
            url: `https://drgeorgehealth.com/services/${id}`,
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

export default function ServiceLayout({ children }: Props) {
    return <>{children}</>;
}
