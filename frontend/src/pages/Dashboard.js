import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart3, TrendingUp, DollarSign, Users, Zap, Target } from 'lucide-react';
import Layout from '../components/Layout';
import { analyticsService } from '../services/api';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsService.getUserAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-green-100">
            Here's your investment overview and impact summary
          </p>
        </div>

        {/* Statistics Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <Zap size={32} className="text-green-600" />
            </div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={DollarSign}
              title="Total Lent"
              value={`$${(analytics?.totalMoneyLent || 0).toLocaleString()}`}
              color="#10B981"
            />
            <StatCard
              icon={Target}
              title="Active Loans"
              value={analytics?.activeLoans || 0}
              color="#3B82F6"
            />
            <StatCard
              icon={TrendingUp}
              title="Interest Earned"
              value={`$${(analytics?.totalInterestEarned || 0).toFixed(2)}`}
              color="#F59E0B"
            />
            <StatCard
              icon={BarChart3}
              title="Credit Score"
              value={analytics?.creditScore || 0}
              color="#8B5CF6"
            />
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-8">
              No recent activity yet. Start exploring projects!
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Target size={28} className="text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Explore Projects</h3>
            <p className="text-gray-600 text-sm">Find new investment opportunities</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Users size={28} className="text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">View Lenders</h3>
            <p className="text-gray-600 text-sm">Connect with other investors</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <BarChart3 size={28} className="text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
            <p className="text-gray-600 text-sm">Detailed performance insights</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
