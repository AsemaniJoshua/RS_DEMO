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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

const blogPostsData = [
  {
    id: 1,
    title: "Understanding Drug Interactions: What You Need to Know",
    category: "Drug Safety",
    author: "Dr. George",
    status: "Published",
    views: 1245,
    created: "2024-12-01",
    updated: "2024-12-01",
  },
  {
    id: 2,
    title: "Managing Type 2 Diabetes Through Lifestyle Changes",
    category: "Diabetes",
    author: "Dr. George",
    status: "Published",
    views: 2156,
    created: "2024-11-28",
    updated: "2024-11-29",
  },
  {
    id: 3,
    title: "The Truth About Dietary Supplements: Myths vs. Facts",
    category: "Supplements",
    author: "Dr. George",
    status: "Published",
    views: 1876,
    created: "2024-11-25",
    updated: "2024-11-25",
  },
  {
    id: 4,
    title: "Youth Drug Abuse: Warning Signs Parents Should Know",
    category: "Youth Drug Abuse",
    author: "Dr. George",
    status: "Published",
    views: 987,
    created: "2024-11-20",
    updated: "2024-11-20",
  },
  {
    id: 5,
    title: "Blood Pressure Medications: A Complete Guide",
    category: "Drug Safety",
    author: "Dr. George",
    status: "Draft",
    views: 0,
    created: "2024-11-18",
    updated: "2024-11-18",
  },
  {
    id: 6,
    title: "Weight Loss: Evidence-Based Strategies That Actually Work",
    category: "Health & Wellness",
    author: "Dr. George",
    status: "Scheduled",
    views: 0,
    created: "2024-11-15",
    updated: "2024-11-16",
  },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPosts = blogPostsData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalViews = blogPostsData.reduce((sum, p) => sum + p.views, 0);
  const publishedCount = blogPostsData.filter((p) => p.status === "Published").length;
  const draftCount = blogPostsData.filter((p) => p.status === "Draft").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published":
        return <Badge variant="success">{status}</Badge>;
      case "Draft":
        return <Badge variant="secondary">{status}</Badge>;
      case "Scheduled":
        return <Badge variant="warning">{status}</Badge>;
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
              Total Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPostsData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Blog Posts</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Published", "Draft", "Scheduled"].map((status) => (
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
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium line-clamp-1">{post.title}</div>
                      <div className="text-xs text-muted-foreground">
                        by {post.author}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>{post.views.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    {new Date(post.updated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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
