import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: (userData) => API.post('/api/auth/register', userData),
  login: (credentials) => API.post('/api/auth/login', credentials),
  getCurrentUser: () => API.get('/api/auth/me'),
  logout: () => API.post('/api/auth/logout')
};

// User Services
export const userService = {
  getUser: (userId) => API.get(`/api/users/${userId}`),
  updateProfile: (userId, userData) => API.put(`/api/users/${userId}`, userData),
  getUserStats: (userId) => API.get(`/api/users/${userId}/stats`)
};

// Project Services
export const projectService = {
  getProjects: (params) => API.get('/api/projects', { params }),
  getProject: (projectId) => API.get(`/api/projects/${projectId}`),
  createProject: (projectData) => API.post('/api/projects', projectData),
  updateProject: (projectId, projectData) => API.put(`/api/projects/${projectId}`, projectData),
  searchProjects: (query) => API.get(`/api/projects/search/${query}`)
};

// Loan Services
export const loanService = {
  getLoans: (params) => API.get('/api/loans', { params }),
  getLoan: (loanId) => API.get(`/api/loans/${loanId}`),
  createLoan: (loanData) => API.post('/api/loans', loanData),
  cancelLoan: (loanId) => API.delete(`/api/loans/${loanId}`),
  recordPayment: (loanId, paymentData) => API.post(`/api/loans/${loanId}/payment`, paymentData),
  downloadPdf: (loanId, type) => API.get(`/api/loans/${loanId}/${type}`, { responseType: 'blob' })
};

// Notification Services
export const notificationService = {
  getNotifications: (params) => API.get('/api/notifications', { params }),
  markAsRead: (notificationId) => API.put(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => API.put('/api/notifications/read-all')
};

// Analytics Services
export const analyticsService = {
  getPlatformAnalytics: () => API.get('/api/analytics/platform'),
  getUserAnalytics: () => API.get('/api/analytics/user')
};

// Recommendation Services
export const recommendationService = {
  getRecommendations: () => API.get('/api/recommendations'),
  getPersonalized: () => API.get('/api/recommendations/personalized')
};

// Blog Services
export const blogService = {
  getBlogs: (params) => API.get('/api/blogs', { params }),
  getBlog: (blogId) => API.get(`/api/blogs/${blogId}`),
  createBlog: (blogData) => API.post('/api/blogs', blogData)
};

// Contact Services
export const contactService = {
  sendMessage: (contactData) => API.post('/api/contact', contactData)
};

export default API;
