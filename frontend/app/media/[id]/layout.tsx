import { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    
    let media = null;
    try {
        const res = await fetch(`${apiUrl}/public/media/${id}`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const json = await res.json();
            media = json.data?.media || json.data;
        }
    } catch (err) {
        console.error("Failed to fetch media metadata:", err);
    }

    if (!media) {
        return {
            title: "Media Not Found | Dr. George",
            description: "The requested media file could not be found."
        };
    }

    const title = media.name || media.original_name;
    const cleanDescription = media.description?.replace(/<[^>]*>/g, '').slice(0, 160) || 'Check out this media content from Dr. George';
    
    // Set fallback dynamic image
    const image = media.file_type === 'IMAGE' ? media.url : '';

    return {
        title: `${title} | Dr. George`,
        description: cleanDescription,
        openGraph: {
            title: title,
            description: cleanDescription,
            type: "video.other" as any, // fallback video type or website
            url: `https://drgeorgehealth.com/media/${id}`,
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

export default function MediaLayout({ children }: Props) {
    return <>{children}</>;
}
