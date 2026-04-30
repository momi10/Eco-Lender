import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, Bell, Shield, Eye, Globe, Moon, Save } from 'lucide-react';
import Layout from '../components/Layout';

const Settings = () => {
  const { user } = useSelector(state => state.auth);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: user?.preferences?.notifications?.email ?? true,
      sms: user?.preferences?.notifications?.sms ?? false,
      push: user?.preferences?.notifications?.push ?? true
    },
    riskTolerance: user?.preferences?.riskTolerance || 'medium',
    categories: user?.preferences?.category || ['Solar Power', 'Urban Farming', 'Water Conservation'],
    twoFactor: user?.twoFactorEnabled || false,
    darkMode: localStorage.getItem('theme') === 'dark',
    language: 'en'
  });

  const allCategories = [
    'Solar Power', 'Urban Farming', 'Water Conservation',
    'Renewable Energy', 'Waste Management', 'Community Garden',
    'Clean Transportation', 'Eco Housing'
  ];

  const handleToggle = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handleCategoryToggle = (cat) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSave = () => {
    // In production, this would call userService.updateProfile
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-green-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

        {saved && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Settings saved successfully!
          </div>
        )}

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Bell size={20} className="text-green-600" /> Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Toggle
                enabled={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive text message alerts</p>
              </div>
              <Toggle
                enabled={settings.notifications.sms}
                onChange={() => handleToggle('notifications', 'sms')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <Toggle
                enabled={settings.notifications.push}
                onChange={() => handleToggle('notifications', 'push')}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Shield size={20} className="text-green-600" /> Security
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Toggle
                enabled={settings.twoFactor}
                onChange={() => setSettings(prev => ({ ...prev, twoFactor: !prev.twoFactor }))}
              />
            </div>
            <div>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                Change Password →
              </button>
            </div>
          </div>
        </div>

        {/* Investment Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <Eye size={20} className="text-green-600" /> Investment Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-2">Risk Tolerance</p>
              <div className="flex gap-3">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSettings(prev => ({ ...prev, riskTolerance: level }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      settings.riskTolerance === level
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-2">Preferred Categories</p>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      settings.categories.includes(cat)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Moon size={20} className="text-green-600" /> Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Switch to dark theme</p>
            </div>
            <Toggle
              enabled={settings.darkMode}
              onChange={() => {
                const newMode = !settings.darkMode;
                setSettings(prev => ({ ...prev, darkMode: newMode }));
                if (newMode) {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                }
              }}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
