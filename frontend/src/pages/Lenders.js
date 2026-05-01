import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, TrendingUp, DollarSign, Award } from 'lucide-react';
import Layout from '../components/Layout';
import { loanService } from '../services/api';
import API from '../services/api';

const Lenders = () => {
  const [lenders, setLenders] = useState([]);
  const [filteredLenders, setFilteredLenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchLenders();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      setFilteredLenders(
        lenders.filter(l =>
          `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredLenders(lenders);
    }
  }, [searchText, lenders]);

  const fetchLenders = async () => {
    try {
      // Fetch loans and extract unique lenders with their investment totals
      const response = await loanService.getLoans({ limit: 100 });
      const loans = response.data.loans || [];

      // Also try fetching from projects as fallback
      let projectLenders = [];
      try {
        const projRes = await API.get('/api/projects?limit=50');
        const projects = projRes.data.projects || [];
        projects.forEach(project => {
          if (project.owner) {
            projectLenders.push({
              _id: project.owner._id,
              firstName: project.owner.firstName,
              lastName: project.owner.lastName,
              avatar: project.owner.avatar,
              totalInvested: 0,
              projectCount: 1,
              source: 'project_owner'
            });
          }
        });
      } catch {}

      // Aggregate actual lenders from loan data
      const lenderMap = {};
      loans.forEach(loan => {
        if (loan.lender) {
          const id = loan.lender._id;
          if (!lenderMap[id]) {
            lenderMap[id] = {
              _id: id,
              firstName: loan.lender.firstName,
              lastName: loan.lender.lastName,
              email: loan.lender.email,
              avatar: loan.lender.avatar,
              totalInvested: 0,
              projectCount: 0,
              projects: new Set()
            };
          }
          lenderMap[id].totalInvested += loan.principalAmount || 0;
          if (loan.project) {
            lenderMap[id].projects.add(loan.project._id || loan.project);
          }
        }
      });

      // Merge project owners that aren't already lenders
      projectLenders.forEach(pl => {
        if (!lenderMap[pl._id]) {
          lenderMap[pl._id] = { ...pl, projects: new Set() };
        }
      });

      // Convert to array
      const lenderList = Object.values(lenderMap).map(l => ({
        ...l,
        projectCount: l.projects ? l.projects.size : l.projectCount || 0
      }));

      // Sort by total invested (desc)
      lenderList.sort((a, b) => b.totalInvested - a.totalInvested);

      setLenders(lenderList);
      setFilteredLenders(lenderList);
    } catch (error) {
      console.error('Error fetching lenders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={28} className="text-green-600" /> Lender Community
            </h1>
            <p className="text-gray-600 mt-1">
              Discover investors making a difference
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search lenders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading lender community...</p>
          </div>
        ) : filteredLenders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No lenders found</h3>
            <p className="text-gray-500 mt-1">
              {searchText ? 'Try a different search term' : 'Be the first to invest in a green project!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLenders.map((lender, idx) => (
              <div key={lender._id || idx} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={lender.avatar || `https://ui-avatars.com/api/?name=${lender.firstName}+${lender.lastName}&background=10B981&color=fff`}
                    alt={`${lender.firstName} ${lender.lastName}`}
                    className="w-14 h-14 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {lender.firstName} {lender.lastName}
                    </h3>
                    {idx < 3 && lender.totalInvested > 0 && (
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1">
                        <Award size={10} /> Top Investor
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium mb-1">
                      <DollarSign size={12} /> Invested
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      ${lender.totalInvested.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-medium mb-1">
                      <TrendingUp size={12} /> Projects
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {lender.projectCount}
                    </p>
                  </div>
                </div>

                {lender._id && (
                  <Link
                    to={`/profile/${lender._id}`}
                    className="block mt-4 text-center text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View Profile →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Lenders;
