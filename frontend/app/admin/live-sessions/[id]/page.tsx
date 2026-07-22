import LiveSessionDetailsClient from "./LiveSessionDetailsClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function LiveSessionDetailsPage() {
    return <LiveSessionDetailsClient />;
}
