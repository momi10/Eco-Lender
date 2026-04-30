import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [devInfo, setDevInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('/api/auth/forgot-password', { email });
      setSent(true);
      // In development, the backend returns the reset URL for testing
      if (response.data.resetUrl) {
        setDevInfo(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            If an account exists with <strong>{email}</strong>, we've sent a password reset link.
            Please check your inbox and spam folder.
          </p>

          {/* Dev mode info */}
          {devInfo && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <p className="text-xs font-semibold text-yellow-800 mb-1">🛠 Development Mode</p>
              <p className="text-xs text-yellow-700 break-all">
                Reset link: <a href={devInfo.resetUrl} className="text-blue-600 underline">{devInfo.resetUrl}</a>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => { setSent(false); setDevInfo(null); }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Send Again
            </button>
            <Link
              to="/login"
              className="block text-green-600 hover:text-green-700 font-medium text-sm"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <Link to="/login" className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium mb-6">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600 mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
