import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Eye, User } from 'lucide-react';
import Layout from '../components/Layout';
import { blogService } from '../services/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogService.getBlogs();
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eco-Lender Blog</h1>
            <p className="text-gray-600 mt-1">Insights on sustainable finance and green initiatives</p>
          </div>
          <Link
            to="/create-blog"
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
          >
            Add Blog Post
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <Link key={blog._id} to={`/blog/${blog._id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {blog.featured_image && (
                    <img src={blog.featured_image} alt={blog.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {blog.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2 mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {blog.author?.firstName} {blog.author?.lastName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {blog.views || 0} views
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No blog posts yet</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for eco-finance insights</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blogs;
