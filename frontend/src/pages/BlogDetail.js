import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, User, Tag } from 'lucide-react';
import Layout from '../components/Layout';
import { blogService } from '../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlog(id);
      setBlog(response.data.blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12"><p className="text-gray-600">Loading...</p></div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="text-center py-12"><p className="text-red-600">Blog post not found</p></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/blogs" className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Blog
        </Link>

        <article className="bg-white rounded-lg shadow overflow-hidden">
          {blog.featured_image && (
            <img src={blog.featured_image} alt={blog.title} className="w-full h-64 object-cover" />
          )}
          <div className="p-8">
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              {blog.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-4">{blog.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
              <span className="flex items-center gap-1">
                <User size={14} /> {blog.author?.firstName} {blog.author?.lastName}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={14} /> {blog.views} views
              </span>
            </div>

            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-gray-400" />
                {blog.tags.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogDetail;
