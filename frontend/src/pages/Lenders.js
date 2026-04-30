import React, { useState, useEffect } from 'react';
import { Users, Search, Award, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api';

const Lenders = () => {
  const [lenders, setLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLenders();
  }, []);

  const fetchLenders = async () => {
    try {
      // Use projects endpoint to find active lenders (since there's no dedicated lenders endpoint)
      const response = await API.get('/api/projects?limit=50');
      const projects = response.data.projects || [];
      
      // Extract unique project owners as "lenders"
      const uniqueOwners = {};
      projects.forEach(p => {
        if (p.owner && !uniqueOwners[p.owner._id]) {
          uniqueOwners[p.owner._id] = {
            ...p.owner,
            projectCount: 1,
            totalFunding: p.targetAmount || 0
          };
        } else if (p.owner && uniqueOwners[p.owner._id]) {
          uniqueOwners[p.owner._id].projectCount += 1;
          uniqueOwners[p.owner._id].totalFunding += p.targetAmount || 0;
        }
      });
      
      setLenders(Object.values(uniqueOwners));
    } catch (error) {
      console.error('Error fetching lenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = lenders.filter(l =>
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lenders Community</h1>
          <p className="text-gray-600 mt-1">Connect with eco-conscious investors</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lenders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Lenders Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading lenders...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(lender => (
              <Link key={lender._id} to={`/profile/${lender._id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={lender.avatar || `https://ui-avatars.com/api/?name=${lender.firstName}+${lender.lastName}&background=10B981&color=fff`}
                      alt={`${lender.firstName} ${lender.lastName}`}
                      className="w-14 h-14 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{lender.firstName} {lender.lastName}</h3>
                      <p className="text-sm text-gray-600">Eco Investor</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-green-600">{lender.projectCount}</p>
                      <p className="text-xs text-gray-600">Projects</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-blue-600">${lender.totalFunding?.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Total Value</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No lenders found</p>
            <p className="text-gray-400 text-sm mt-1">Be the first to invest in a green project!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Lenders;
