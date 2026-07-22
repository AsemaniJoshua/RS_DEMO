import EditUserClient from "./EditUserClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditUserPage() {
    return <EditUserClient />;
}
