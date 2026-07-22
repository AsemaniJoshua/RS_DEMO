import ServiceDetailPublicClient from "./ServiceDetailPublicClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function ServiceDetailPage() {
    return <ServiceDetailPublicClient />;
}
