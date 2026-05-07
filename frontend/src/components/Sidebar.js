import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home, Leaf, DollarSign, Users, BarChart3, Settings, LogOut,
  ChevronRight, PlusCircle, BookOpen, Mail, Bell
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const baseMenuItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard', roles: ['all'] },
    { label: user?.userType === 'lender' ? 'Explore Projects' : 'Projects', icon: Leaf, path: '/projects', roles: ['all'] },
    { label: user?.userType === 'lender' ? 'My Investments' : 'My Loans', icon: DollarSign, path: '/loans', roles: ['all'] },
    { label: 'Lenders', icon: Users, path: '/lenders', roles: ['borrower', 'admin'] }, // Only borrowers need to browse lenders
    { label: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['all'] },
    { label: 'Notifications', icon: Bell, path: '/notifications', roles: ['all'] },
    { label: 'Blog', icon: BookOpen, path: '/blogs', roles: ['all'] },
    { label: 'Contact', icon: Mail, path: '/contact', roles: ['all'] },
    { label: 'Settings', icon: Settings, path: '/settings', roles: ['all'] }
  ];

  const menuItems = baseMenuItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(user?.userType)
  );

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-16 lg:top-0 left-0 w-64 min-h-[calc(100vh-64px)] bg-gray-900 text-white transition-transform duration-300 ease-in-out transform flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40`}
      >
        {/* User Section */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}`}
              alt={user?.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.firstName}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.userType}</p>
            </div>
          </div>
          {user?.userType === 'borrower' && (
            <Link
              to="/create-project"
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold"
            >
              <PlusCircle size={16} /> New Project
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="flex items-center gap-2 w-full text-gray-300 hover:text-red-400 py-2 px-4 transition-colors rounded-lg hover:bg-gray-800"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
