import AppointmentDetailClient from "./AppointmentDetailClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function ViewAppointmentPage() {
    return <AppointmentDetailClient />;
}
