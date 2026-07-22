import UserDetailsClient from "./UserDetailsClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function UserDetailsPage() {
    return <UserDetailsClient />;
}
