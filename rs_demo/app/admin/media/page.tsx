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
import { Upload, Search, Eye, Trash2, Video, Image as ImageIcon, FileText } from "lucide-react";

const mediaData = [
  {
    id: 1,
    title: "Understanding Medication Safety in the Home",
    type: "Video",
    category: "TV Appearance",
    size: "124 MB",
    duration: "12:45",
    views: 15234,
    uploaded: "2024-11-30",
    status: "Published",
  },
  {
    id: 2,
    title: "Managing Diabetes: A Pharmacist's Perspective",
    type: "Video",
    category: "YouTube",
    size: "256 MB",
    duration: "18:30",
    views: 28450,
    uploaded: "2024-11-25",
    status: "Published",
  },
  {
    id: 3,
    title: "Supplement Safety Infographic",
    type: "Image",
    category: "Graphics",
    size: "2.4 MB",
    duration: "-",
    views: 8760,
    uploaded: "2024-11-20",
    status: "Published",
  },
  {
    id: 4,
    title: "Youth Drug Abuse Prevention Webinar",
    type: "Video",
    category: "Webinar",
    size: "480 MB",
    duration: "55:20",
    views: 8543,
    uploaded: "2024-11-15",
    status: "Published",
  },
  {
    id: 5,
    title: "Blood Pressure Guide PDF",
    type: "Document",
    category: "Resources",
    size: "1.2 MB",
    duration: "-",
    views: 3421,
    uploaded: "2024-11-10",
    status: "Draft",
  },
  {
    id: 6,
    title: "Weight Loss Tips Video Series - Episode 1",
    type: "Video",
    category: "YouTube",
    size: "189 MB",
    duration: "14:12",
    views: 12890,
    uploaded: "2024-11-05",
    status: "Published",
  },
];

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredMedia = mediaData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalSize = mediaData.reduce((sum, item) => {
    const size = parseFloat(item.size);
    return sum + size;
  }, 0);

  const totalViews = mediaData.reduce((sum, item) => sum + item.views, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4" />;
      case "Image":
        return <ImageIcon className="h-4 w-4" />;
      case "Document":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "outline"> = {
      Video: "default",
      Image: "secondary",
      Document: "outline",
    };
    return (
      <Badge variant={colors[type] || "default"}>
        <span className="mr-1">{getTypeIcon(type)}</span>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mediaData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mediaData.filter((m) => m.type === "Video").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Media Library</CardTitle>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["All", "Video", "Image", "Document"].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                >
                  {type}
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
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedia.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium line-clamp-1">{item.title}</div>
                  </TableCell>
                  <TableCell>{getTypeBadge(item.type)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.size}</TableCell>
                  <TableCell className="text-sm">{item.duration}</TableCell>
                  <TableCell>{item.views.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(item.uploaded).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
