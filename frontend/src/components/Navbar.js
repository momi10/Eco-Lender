import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Bell, User, LogOut, Home, Leaf, Search } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 2) {
      try {
        const API = (await import('../services/api')).default;
        const response = await API.get(`/api/projects/search/${encodeURIComponent(query.trim())}`);
        setSearchResults(response.data.projects?.slice(0, 5) || []);
        setShowResults(true);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-green-700 rounded-lg"
              >
                <Menu size={24} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:text-green-100">
              <Leaf size={28} />
              Eco-Lender
            </Link>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  placeholder="Search projects..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </form>

            {/* Search Dropdown Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border text-gray-800 z-50 overflow-hidden">
                {searchResults.map(project => (
                  <button
                    key={project._id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigate(`/project/${project._id}`);
                      setShowResults(false);
                      setSearchQuery('');
                    }}
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 text-left"
                  >
                    <Leaf size={14} className="text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.category}</p>
                    </div>
                  </button>
                ))}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
                    setShowResults(false);
                  }}
                  type="button"
                  className="w-full text-center text-sm text-green-600 font-medium py-2 hover:bg-gray-50"
                >
                  View all results →
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link to="/notifications" className="relative hover:bg-green-700 p-2 rounded-lg">
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 hover:bg-green-700 p-2 rounded-lg"
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
                      alt={user?.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden sm:inline text-sm">{user?.firstName}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl">
                      <Link
                        to={`/profile/${user?._id}`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Home size={16} /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-b-lg w-full text-left text-red-600"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-green-700 px-4 py-2 rounded-lg">
                  Login
                </Link>
                <Link to="/signup" className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

