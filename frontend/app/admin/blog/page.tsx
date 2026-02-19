"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { blogService, Blog } from "@/services/blog-service";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";

export default function BlogManagerPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
    const [publishingId, setPublishingId] = useState<string | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, [page, statusFilter]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await blogService.getAllBlogs({
                page,
                limit: 10,
                status: statusFilter || undefined,
                search: searchTerm || undefined
            });
            
            const data = (response.data as any);
            setBlogs(data.blogs || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error: any) {
            toast.error(error.message || "Failed to load blogs");
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchBlogs();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSearch = () => {
        setPage(1);
        fetchBlogs();
    };

    const handleDeleteClick = (blog: Blog) => {
        setBlogToDelete(blog);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!blogToDelete) return;

        try {
            setDeleting(true);
            await blogService.deleteBlog(blogToDelete.id);
            toast.success("Blog deleted successfully!");
            setShowDeleteModal(false);
            setBlogToDelete(null);
            fetchBlogs();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete blog");
        } finally {
            setDeleting(false);
        }
    };

    const handlePublishToggle = async (blog: Blog) => {
        try {
            setPublishingId(blog.id);
            if (blog.status === 'PUBLISHED') {
                await blogService.unpublishBlog(blog.id);
                toast.success("Blog unpublished!");
            } else {
                await blogService.publishBlog(blog.id);
                toast.success("Blog published!");
            }
            fetchBlogs();
        } catch (error: any) {
            toast.error(error.message || "Failed to update blog status");
        } finally {
            setPublishingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            PUBLISHED: "bg-green-100 text-green-800",
            DRAFT: "bg-yellow-100 text-yellow-800",
            ARCHIVED: "bg-gray-100 text-gray-800"
        };
        return styles[status as keyof typeof styles] || styles.DRAFT;
    };

    if (loading && page === 1) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066ff]"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Manager</h1>
                    <p className="text-gray-600 mt-1">Create and manage blog posts</p>
                </div>
                <Link
                    href="/admin/blog/create"
                    className="px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors"
                >
                    + Create Blog Post
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066ff] focus:border-transparent text-gray-900"
                    >
                        <option value="">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                    </select>

                </div>
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full table-fixed min-w-[900px]">
                    <colgroup>
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '220px' }} />
                        <col style={{ width: '160px' }} />
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '120px' }} />
                        <col style={{ width: '180px' }} />
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No blogs found. Create your first blog post!
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                            {blog.featured_image ? (
                                                <img 
                                                    src={blog.featured_image} 
                                                    alt={blog.title} 
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-[200px] align-top">
                                        <Link href={`/admin/blog/${blog.id}`} className="block group">
                                            <div className="text-sm font-medium text-gray-900 group-hover:text-[#0066ff] transition-colors">{blog.title}</div>
                                            {blog.excerpt && (
                                                <div
                                                    className="text-sm text-gray-500 mt-1 overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]"
                                                    style={{ textOverflow: 'ellipsis', display: 'block' }}
                                                    dangerouslySetInnerHTML={{ __html: blog.excerpt.replace(/<[^>]*>/g, '') }}
                                                />
                                            )}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {blog.author ? `${blog.author.first_name} ${blog.author.last_name}` : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(blog.status)}`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-1 items-center">
                                            <button
                                                onClick={() => handlePublishToggle(blog)}
                                                disabled={publishingId === blog.id}
                                                className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                                                    blog.status === 'PUBLISHED'
                                                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                } ${publishingId === blog.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                title={blog.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                                            >
                                                {publishingId === blog.id ? (
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                    </svg>
                                                ) : (
                                                    blog.status === 'PUBLISHED' ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                                                    )
                                                )}
                                            </button>
                                            <Link
                                                href={`/admin/blog/${blog.id}`}
                                                className="p-2 rounded-full bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/blog/${blog.id}/edit`}
                                                className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center justify-center"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6z" /></svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(blog)}
                                                className="p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center justify-center"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-900"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-900">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-900"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Blog Post</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setBlogToDelete(null);
                                }}
                                disabled={deleting}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting && (
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
