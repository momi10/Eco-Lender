import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';
import { BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const CreateBlog = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'News',
    tags: '',
    featured_image: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      
      await API.post('/api/blogs', payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/blogs');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2">You must be logged in to create a blog post.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <BookOpen size={32} className="text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
            <p className="text-gray-600">Share your insights on sustainable finance</p>
          </div>
        </div>

        {success ? (
          <div className="bg-green-50 text-green-800 p-6 rounded-lg flex flex-col items-center justify-center text-center">
            <CheckCircle size={48} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Blog Post Created!</h2>
            <p>Your post has been successfully published. Redirecting to blogs...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Short description of your post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="10"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Write your blog post content here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Sustainability">Sustainability</option>
                    <option value="Finance">Finance</option>
                    <option value="Community">Community</option>
                    <option value="Technology">Technology</option>
                    <option value="News">News</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="eco, solar, finance"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Blog Post'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default CreateBlog;
