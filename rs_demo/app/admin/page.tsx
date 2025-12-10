"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Video,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    title: "Total Revenue",
    value: "$12,345",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Products Sold",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-blue-600",
  },
  {
    title: "Appointments",
    value: "48",
    change: "+15.3%",
    trend: "up",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Blog Views",
    value: "8,432",
    change: "-2.4%",
    trend: "down",
    icon: FileText,
    color: "text-orange-600",
  },
];

const recentAppointments = [
  {
    id: 1,
    client: "John Doe",
    service: "Medication Review",
    date: "2024-12-15",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    client: "Jane Smith",
    service: "Diabetes Consultation",
    date: "2024-12-15",
    time: "2:00 PM",
    status: "Pending",
  },
  {
    id: 3,
    client: "Mike Johnson",
    service: "Supplement Session",
    date: "2024-12-16",
    time: "11:30 AM",
    status: "Confirmed",
  },
];

const recentProducts = [
  { id: 1, name: "Understanding Drug Safety", sales: 45, revenue: "$899.55" },
  { id: 2, name: "Diabetes Management Masterclass", sales: 32, revenue: "$1,599.68" },
  { id: 3, name: "Supplement Safety Guide", sales: 28, revenue: "$419.72" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={stat.trend === "up" ? "text-green-600" : "text-red-600"}
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {/* Chart placeholder - integrate with recharts or similar */}
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
                <p className="text-sm">Revenue chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {/* Chart placeholder */}
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 mx-auto opacity-50" />
                <p className="text-sm">Traffic analytics chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Appointments</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/appointments">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{apt.client}</p>
                    <p className="text-sm text-muted-foreground">{apt.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.date}</p>
                    <p className="text-xs text-muted-foreground">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Products</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="font-semibold text-green-600">
                    {product.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button asChild>
              <Link href="/admin/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/blog">
                <FileText className="h-4 w-4 mr-2" />
                New Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/media">
                <Video className="h-4 w-4 mr-2" />
                Upload Media
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
