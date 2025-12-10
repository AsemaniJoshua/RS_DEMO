"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const appointmentsData = [
  {
    id: 1,
    client: "John Doe",
    email: "john.doe@example.com",
    service: "Medication Review",
    date: "2024-12-15",
    time: "10:00 AM",
    duration: "45 mins",
    price: 75,
    status: "Confirmed",
  },
  {
    id: 2,
    client: "Jane Smith",
    email: "jane.smith@example.com",
    service: "Diabetes Consultation",
    date: "2024-12-15",
    time: "2:00 PM",
    duration: "60 mins",
    price: 100,
    status: "Pending",
  },
  {
    id: 3,
    client: "Mike Johnson",
    email: "mike.j@example.com",
    service: "Supplement Session",
    date: "2024-12-16",
    time: "11:30 AM",
    duration: "30 mins",
    price: 50,
    status: "Confirmed",
  },
  {
    id: 4,
    client: "Sarah Williams",
    email: "sarah.w@example.com",
    service: "Weight Loss Coaching",
    date: "2024-12-16",
    time: "3:00 PM",
    duration: "60 mins",
    price: 90,
    status: "Confirmed",
  },
  {
    id: 5,
    client: "David Brown",
    email: "david.brown@example.com",
    service: "Medication Review",
    date: "2024-12-17",
    time: "9:00 AM",
    duration: "45 mins",
    price: 75,
    status: "Cancelled",
  },
  {
    id: 6,
    client: "Emily Davis",
    email: "emily.d@example.com",
    service: "Diabetes Consultation",
    date: "2024-12-18",
    time: "1:00 PM",
    duration: "60 mins",
    price: 100,
    status: "Pending",
  },
];

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAppointments = appointmentsData.filter((apt) => {
    const matchesSearch =
      apt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = appointmentsData
    .filter((a) => a.status === "Confirmed")
    .reduce((sum, a) => sum + a.price, 0);

  const statusCounts = {
    confirmed: appointmentsData.filter((a) => a.status === "Confirmed").length,
    pending: appointmentsData.filter((a) => a.status === "Pending").length,
    cancelled: appointmentsData.filter((a) => a.status === "Cancelled").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <Badge variant="success">{status}</Badge>;
      case "Pending":
        return <Badge variant="warning">{status}</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expected Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointments</CardTitle>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.client}</div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.duration}</TableCell>
                  <TableCell className="font-medium">${appointment.price}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {appointment.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
