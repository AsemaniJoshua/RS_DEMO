import EditLiveSessionClient from "./EditLiveSessionClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditLiveSessionPage() {
    return <EditLiveSessionClient />;
}
