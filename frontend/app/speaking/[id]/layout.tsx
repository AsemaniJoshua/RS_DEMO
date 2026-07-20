import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    
    let event = null;
    try {
        const res = await fetch(`${apiUrl}/public/speaking/${id}`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const json = await res.json();
            event = json.data?.event || json.data;
        }
    } catch (err) {
        console.error("Failed to fetch speaking event metadata:", err);
    }

    if (!event) {
        return {
            title: "Event Not Found | Dr. George",
            description: "The requested speaking event details could not be found."
        };
    }

    const title = event.title;
    const cleanDescription = event.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Join Dr. George at ${event.venue} in ${event.location}.`;
    const image = event.image || '';

    return {
        title: `${title} | Dr. George`,
        description: cleanDescription,
        openGraph: {
            title: title,
            description: cleanDescription,
            type: "website",
            url: `https://drgeorgehealth.com/speaking/${id}`,
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

export default function SpeakingLayout({ children }: Props) {
    return <>{children}</>;
}
