import EditSpeakingEventClient from "./EditSpeakingEventClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditSpeakingEventPage() {
    return <EditSpeakingEventClient />;
}
