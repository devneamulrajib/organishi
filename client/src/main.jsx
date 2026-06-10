import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import App from './App';
import Admin from './Admin';
import Login from './Login';

// Import CSS files
import './index.css';
import './homepage.css';

// ── Subdomain Detection Logic ──
const hostname = window.location.hostname;
// This checks if the user is on admin.organishi.com
const isAdminDomain = hostname.startsWith('admin.');

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {isAdminDomain ? (
          /* ── ROUTES FOR ADMIN.ORGANISHI.COM ── */
          <>
            <Route path="/" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            {/* Redirect any other path on subdomain to root */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* ── ROUTES FOR ORGANISHI.COM ── */
          <>
            <Route path="/" element={<Layout><App /></Layout>} />
            <Route path="/login" element={<Login />} />
            {/* If someone types /admin on the main site, send them to the subdomain */}
            <Route path="/admin" element={<Navigate to="https://admin.organishi.com" />} />
            
            {/* Add other shop routes here (e.g., /products) */}
            {/* <Route path="/products" element={<Layout><Products /></Layout>} /> */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);