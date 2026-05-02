import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Users, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { projectService, loanService } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectService.getProject(id);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!investAmount || isNaN(investAmount) || investAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    
    setIsInvesting(true);
    setMessage('');
    
    try {
      await loanService.createLoan({
        borrowerId: project.owner?._id || project.owner || '',
        projectId: project._id,
        principalAmount: Number(investAmount),
        interestRate: project.interestRate || 5,
        duration: project.duration || 12
      });
      
      setMessage('Investment successful!');
      setInvestAmount('');
      fetchProject(); // Refresh project details
    } catch (error) {
      console.error('Error investing:', error);
      setMessage(error.response?.data?.message || 'Failed to process investment. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">Project not found</p>
        </div>
      </Layout>
    );
  }

  const fundingPercentage = (project.fundedAmount / project.targetAmount) * 100;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={18} />
            {project.location?.city}, {project.location?.country}
          </div>
          <p className="text-gray-700 text-lg">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {project.images && project.images.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Project Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Category</p>
                  <p className="font-semibold text-gray-900">{project.category}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{project.duration} months</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Interest Rate</p>
                  <p className="font-semibold text-gray-900">{project.interestRate}% p.a.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Status</p>
                  <p className="font-semibold text-green-600 capitalize">{project.status}</p>
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Environmental Impact</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {project.impact?.expectedBeneficiaries || 0}+ Beneficiaries
                    </p>
                    <p className="text-sm text-gray-600">Expected to benefit from this project</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {project.impact?.carbonReductionEstimate || 0} tons CO₂ Reduction
                    </p>
                    <p className="text-sm text-gray-600">Estimated carbon footprint reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">Funding Progress</h3>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {fundingPercentage.toFixed(0)}% funded
                </p>
              </div>

              {/* Amount Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Funded:</span>
                  <span className="font-semibold text-green-600">
                    ${project.fundedAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-semibold text-gray-900">
                    ${project.targetAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Investment Actions */}
              {user?._id === project.owner?._id ? (
                <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-center font-medium">
                  This is your project
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Amount ($)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max={project.targetAmount - project.fundedAmount}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  {message && (
                    <div className={`p-3 rounded text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {message}
                    </div>
                  )}

                  <button
                    onClick={handleInvest}
                    disabled={isInvesting || !investAmount || investAmount <= 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors flex justify-center items-center"
                  >
                    {isInvesting ? 'Processing...' : 'Invest Now'}
                  </button>
                </div>
              )}
            </div>

            {/* Lenders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Lenders ({project.lenders?.length || 0})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {project.lenders && project.lenders.length > 0 ? (
                  project.lenders.map((lender, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">Lender {index + 1}</span>
                      <span className="font-semibold text-gray-900">${lender.amount?.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No lenders yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
