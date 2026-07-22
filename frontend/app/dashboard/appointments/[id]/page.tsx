import DashboardAppointmentClient from "./DashboardAppointmentClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function AppointmentDetailPage() {
    return <DashboardAppointmentClient />;
}
