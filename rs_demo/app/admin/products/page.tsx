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
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";

const productsData = [
  {
    id: 1,
    title: "Understanding Drug Safety",
    type: "eBook",
    price: 19.99,
    sales: 45,
    revenue: 899.55,
    status: "Active",
    created: "2024-10-15",
  },
  {
    id: 2,
    title: "Diabetes Management Masterclass",
    type: "Course",
    price: 49.99,
    sales: 32,
    revenue: 1599.68,
    status: "Active",
    created: "2024-10-10",
  },
  {
    id: 3,
    title: "Supplement Safety Guide",
    type: "eBook",
    price: 14.99,
    sales: 28,
    revenue: 419.72,
    status: "Active",
    created: "2024-09-28",
  },
  {
    id: 4,
    title: "Youth & Drug Abuse Prevention",
    type: "Webinar",
    price: 29.99,
    sales: 18,
    revenue: 539.82,
    status: "Draft",
    created: "2024-11-20",
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productsData.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = productsData.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = productsData.reduce((sum, p) => sum + p.sales, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(product.created).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.type}</Badge>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="h-3 w-3" />
                      {product.revenue.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === "Active" ? "success" : "secondary"}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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
