import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  User, Mail, Phone, MapPin, Edit3, Save, X, Camera,
  Shield, Award, TrendingUp, Globe
} from 'lucide-react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import Layout from '../components/Layout';
import { userService } from '../services/api';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [stats, setStats] = useState(null);

  const userId = id || currentUser?._id;
  const isOwnProfile = userId === currentUser?._id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchStats();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await userService.getUser(userId);
      setProfile(response.data.user);
      setEditData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await userService.getUserStats(userId);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateProfile(userId, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        bio: editData.bio,
        phone: editData.phone,
        address: editData.address,
        socialMedia: editData.socialMedia
      });
      setProfile(response.data.user);
      setEditing(false);
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setEditData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">User not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-600 to-blue-600" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12">
              <div className="relative">
                <img
                  src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=128&background=10B981&color=fff`}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                {isOwnProfile && editing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-green-600 text-white rounded-full shadow">
                    <Camera size={14} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      value={editData.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="text-2xl font-bold border-b border-gray-300 focus:border-green-500 focus:outline-none"
                      placeholder="First Name"
                    />
                    <input
                      value={editData.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="text-2xl font-bold border-b border-gray-300 focus:border-green-500 focus:outline-none"
                      placeholder="Last Name"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                )}
                <p className="text-gray-600 capitalize flex items-center gap-2 mt-1">
                  <Shield size={14} /> {profile.userType} • Joined {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
              {isOwnProfile && (
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                        <Save size={16} /> Save
                      </button>
                      <button onClick={() => { setEditing(false); setEditData(profile); }} className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm">
                        <X size={16} /> Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-3">About</h2>
              {editing ? (
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Tell others about yourself..."
                />
              ) : (
                <p className="text-gray-600 text-sm">{profile.bio || 'No bio yet.'}</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Contact</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} /> {profile.email}
                </div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <input
                      value={editData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Phone number"
                    />
                  </div>
                ) : (
                  profile.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} /> {profile.phone}
                    </div>
                  )
                )}
                {profile.address?.city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} /> {profile.address.city}, {profile.address.country}
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Social Media</h2>
              {editing ? (
                <div className="space-y-2">
                  {['linkedin', 'twitter', 'facebook', 'instagram'].map(platform => (
                    <div key={platform} className="flex items-center gap-2">
                      {platform === 'linkedin' && <FaLinkedin size={16} className="text-blue-600" />}
                      {platform === 'twitter' && <FaTwitter size={16} className="text-sky-500" />}
                      {platform === 'facebook' && <FaFacebook size={16} className="text-blue-700" />}
                      {platform === 'instagram' && <FaInstagram size={16} className="text-pink-600" />}
                      <input
                        value={editData.socialMedia?.[platform] || ''}
                        onChange={(e) => handleNestedChange('socialMedia', platform, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder={`${platform} URL`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3">
                  {profile.socialMedia?.linkedin && (
                    <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100">
                      <FaLinkedin size={20} className="text-blue-600" />
                    </a>
                  )}
                  {profile.socialMedia?.twitter && (
                    <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-50 rounded-lg hover:bg-sky-100">
                      <FaTwitter size={20} className="text-sky-500" />
                    </a>
                  )}
                  {profile.socialMedia?.facebook && (
                    <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100">
                      <FaFacebook size={20} className="text-blue-700" />
                    </a>
                  )}
                  {profile.socialMedia?.instagram && (
                    <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-50 rounded-lg hover:bg-pink-100">
                      <FaInstagram size={20} className="text-pink-600" />
                    </a>
                  )}
                  {!profile.socialMedia?.linkedin && !profile.socialMedia?.twitter && !profile.socialMedia?.facebook && !profile.socialMedia?.instagram && (
                    <p className="text-gray-400 text-sm">No social links added</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <Award size={24} className="mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats?.creditScore || 0}</p>
                <p className="text-xs text-gray-600">Credit Score</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <TrendingUp size={24} className="mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats?.totalLoansGiven || 0}</p>
                <p className="text-xs text-gray-600">Loans Given</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <User size={24} className="mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">${(stats?.totalMoneyLent || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Lent</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <User size={24} className="mx-auto text-purple-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">${(stats?.totalInterestEarned || 0).toFixed(2)}</p>
                <p className="text-xs text-gray-600">Interest Earned</p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Verification Status</h2>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  profile.verificationStatus === 'verified' ? 'bg-green-500' :
                  profile.verificationStatus === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="capitalize font-medium text-gray-700">{profile.verificationStatus || 'Pending'}</span>
              </div>
            </div>

            {/* Preferences */}
            {isOwnProfile && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Investment Preferences</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Preferred Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile.preferences?.category || []).map(cat => (
                        <span key={cat} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Risk Tolerance</p>
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {profile.preferences?.riskTolerance || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
