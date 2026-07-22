import EditEbookClient from "./EditEbookClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditEbookPage() {
    return <EditEbookClient />;
}
