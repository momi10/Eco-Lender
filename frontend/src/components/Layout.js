import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { notificationService } from '../services/api';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch notification count on mount so the Navbar badge works
  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getNotifications({ limit: 1 })
        .then(response => {
          dispatch({
            type: 'FETCH_NOTIFICATIONS_SUCCESS',
            payload: {
              notifications: response.data.notifications || [],
              pagination: response.data.pagination || { unread: 0 }
            }
          });
        })
        .catch(() => {});
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
