import EditAppointmentClient from "./EditAppointmentClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function EditAppointmentPage() {
    return <EditAppointmentClient />;
}
