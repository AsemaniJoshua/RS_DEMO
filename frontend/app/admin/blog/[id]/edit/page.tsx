"use client";

import { useEffect, useState, use } from "react";
import BlogForm from "@/components/admin/BlogForm";
import { blogService, Blog } from "@/services/blog-service";
import toast from "react-hot-toast";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [blog, setBlog] = useState<Blog | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await blogService.getBlogById(id);
                setBlog((response.data as any).blog);
            } catch (error: any) {
                toast.error("Failed to load blog post");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
                <p className="text-gray-600">The blog post you are trying to edit does not exist.</p>
            </div>
        );
    }

    return <BlogForm initialData={blog} isEditing={true} />;
}
