import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Info, AlertTriangle, DollarSign, Leaf } from 'lucide-react';
import Layout from '../components/Layout';
import { notificationService } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'unread') params.isRead = false;
      if (filter === 'read') params.isRead = true;
      const response = await notificationService.getNotifications(params);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIcon = (type) => {
    const icons = {
      loan_created: <DollarSign size={20} className="text-green-600" />,
      loan_payment: <DollarSign size={20} className="text-blue-600" />,
      project_funded: <Leaf size={20} className="text-green-600" />,
      project_update: <Info size={20} className="text-blue-600" />,
      warning: <AlertTriangle size={20} className="text-yellow-600" />,
    };
    return icons[type] || <Bell size={20} className="text-gray-600" />;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
            >
              <CheckCheck size={16} /> Mark All Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'unread', 'read'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-green-500' : ''
                }`}
              >
                <div className="p-2 bg-gray-50 rounded-lg flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notification.title || 'Notification'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                    title="Mark as read"
                  >
                    <Check size={16} className="text-green-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No notifications</p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
