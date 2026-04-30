import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Initialize dark mode from localStorage
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
