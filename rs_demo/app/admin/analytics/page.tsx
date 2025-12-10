"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Globe,
  ShoppingCart,
  Calendar,
  FileText,
} from "lucide-react";

const analyticsData = {
  overview: [
    { label: "Total Visitors", value: "24,567", change: "+12.5%", trend: "up" },
    { label: "Page Views", value: "89,234", change: "+8.3%", trend: "up" },
    { label: "Avg. Session", value: "3m 45s", change: "-2.1%", trend: "down" },
    { label: "Bounce Rate", value: "42.3%", change: "-5.2%", trend: "up" },
  ],
  topPages: [
    { page: "/", views: 15234, visitors: 12890 },
    { page: "/store", views: 8764, visitors: 7234 },
    { page: "/blog", views: 6543, visitors: 5432 },
    { page: "/appointments", views: 4321, visitors: 3876 },
    { page: "/about", views: 3210, visitors: 2987 },
  ],
  trafficSources: [
    { source: "Organic Search", visitors: 12456, percentage: 50.7 },
    { source: "Direct", visitors: 6123, percentage: 24.9 },
    { source: "Social Media", visitors: 3678, percentage: 15.0 },
    { source: "Referral", visitors: 1876, percentage: 7.6 },
    { source: "Email", visitors: 434, percentage: 1.8 },
  ],
  conversions: [
    { type: "Product Sales", count: 156, value: "$3,458.55", rate: "6.4%" },
    { type: "Appointments Booked", count: 48, value: "$4,200.00", rate: "4.2%" },
    { type: "Newsletter Signups", count: 287, value: "-", rate: "11.7%" },
    { type: "Contact Forms", count: 62, value: "-", rate: "2.5%" },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {analyticsData.overview.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp
                  className={`h-3 w-3 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                />
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
        {/* Visitors Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Users className="h-12 w-12 mx-auto opacity-50" />
                <p className="text-sm">Visitor trends chart will be displayed here</p>
                <p className="text-xs">Integration with analytics library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-muted-foreground">
                      {source.visitors.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Top Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{page.page}</div>
                    <div className="text-sm text-muted-foreground">
                      {page.visitors.toLocaleString()} unique visitors
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{page.views.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">page views</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            Conversions & Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {analyticsData.conversions.map((conversion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border space-y-2 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{conversion.type}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    {conversion.rate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{conversion.count}</div>
                    <div className="text-xs text-muted-foreground">conversions</div>
                  </div>
                  {conversion.value !== "-" && (
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {conversion.value}
                      </div>
                      <div className="text-xs text-muted-foreground">revenue</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
            <p className="text-xs text-muted-foreground mt-1">Currently browsing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">$845</div>
            <p className="text-xs text-muted-foreground mt-1">12 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <p className="text-xs text-muted-foreground mt-1">New appointments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
