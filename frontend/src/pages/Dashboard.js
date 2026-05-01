import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart3, TrendingUp, DollarSign, Users, Zap, Target, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { analyticsService, recommendationService, loanService } from '../services/api';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchRecommendations();
    fetchRecentActivity();
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

  const fetchRecommendations = async () => {
    try {
      const response = await recommendationService.getRecommendations();
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await loanService.getLoans({ limit: 5 });
      setRecentLoans(response.data.loans || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
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

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" /> Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map(project => {
                const p = project._doc || project;
                const fundingPct = ((p.fundedAmount || 0) / (p.targetAmount || 1)) * 100;
                return (
                  <Link key={p._id} to={`/project/${p._id}`} className="block h-full">
                    <div className="border border-purple-200 bg-gradient-to-br from-white to-purple-50 rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                        <Sparkles size={10} /> {p.aiMatchScore || 85}% AI Match
                      </div>
                      <div className="flex items-center gap-2 mb-2 mt-1">
                        <Leaf size={14} className="text-green-600" />
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">{p.description}</p>
                      
                      {p.aiInsight && (
                        <div className="mb-3 bg-white/60 p-2 rounded border border-purple-100 text-xs text-purple-800">
                          <span className="font-semibold">AI Insight:</span> {p.aiInsight}
                        </div>
                      )}

                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1 mt-auto">
                        <div
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(fundingPct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{fundingPct.toFixed(0)}% funded</span>
                        <span>{p.interestRate}% APY</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentLoans.length > 0 ? (
              recentLoans.map(loan => (
                <div key={loan._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      loan.status === 'active' ? 'bg-green-500' :
                      loan.status === 'completed' ? 'bg-blue-500' :
                      loan.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {loan.lender?._id === user?._id ? 'Invested in' : 'Received from'}{' '}
                        <span className="text-green-600">{loan.project?.title || 'a project'}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(loan.createdAt).toLocaleDateString()} · {loan.loanId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${loan.principalAmount?.toLocaleString()}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      loan.status === 'active' ? 'bg-green-100 text-green-700' :
                      loan.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                No recent activity yet. Start exploring projects!
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/projects">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Target size={28} className="text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Explore Projects</h3>
              <p className="text-gray-600 text-sm">Find new investment opportunities</p>
            </div>
          </Link>
          <Link to="/lenders">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Users size={28} className="text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">View Lenders</h3>
              <p className="text-gray-600 text-sm">Connect with other investors</p>
            </div>
          </Link>
          <Link to="/analytics">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <BarChart3 size={28} className="text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
              <p className="text-gray-600 text-sm">Detailed performance insights</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
