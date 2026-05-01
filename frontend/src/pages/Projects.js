import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Leaf } from 'lucide-react';
import Layout from '../components/Layout';
import { projectService } from '../services/api';
import { Link, useSearchParams } from 'react-router-dom';

const Projects = () => {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(searchFromUrl);
  const [filters, setFilters] = useState({
    category: '',
    status: 'active',
    page: 1
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchProjects();
  }, [filters, searchFromUrl]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (searchFromUrl || searchText) {
        const query = searchFromUrl || searchText;
        const response = await projectService.searchProjects(query);
        setProjects(response.data.projects || []);
      } else {
        const response = await projectService.getProjects(filters);
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalSearch = () => {
    if (searchText.trim()) {
      projectService.searchProjects(searchText.trim()).then(res => {
        setProjects(res.data.projects || []);
      });
    } else {
      fetchProjects();
    }
  };

  const categories = [
    'Solar Power',
    'Urban Farming',
    'Water Conservation',
    'Renewable Energy',
    'Waste Management'
  ];

  const ProjectCard = ({ project }) => {
    const fundingPercentage = (project.fundedAmount / project.targetAmount) * 100;

    return (
      <Link to={`/project/${project._id}`}>
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
          {project.images && project.images.length > 0 && (
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf size={16} className="text-green-600" />
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {project.category}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

            {/* Funding Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">
                ${project.fundedAmount?.toLocaleString()} / ${project.targetAmount?.toLocaleString()}
              </p>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{project.interestRate}% APY</span>
              <span className="font-semibold text-gray-900">{project.duration}M</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
          <Link
            to="/create-project"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Create Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="active">Active</option>
                <option value="funded">Funded</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocalSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No projects found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
