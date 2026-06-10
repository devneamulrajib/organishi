import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import App from './App';
import Admin from './Admin';
import Login from './Login';

import './index.css';
import './homepage.css';

const hostname = window.location.hostname;
const isAdminDomain = hostname.startsWith('admin.');

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// Redirect component that does a real browser navigation to an external URL
function ExternalRedirect({ to }) {
  React.useEffect(() => {
    window.location.href = to;
  }, []);
  return null;
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* ── ROUTES FOR ORGANISHI.COM ── */
          <>
            <Route path="/" element={<Layout><App /></Layout>} />
            <Route path="/login" element={<Login />} />
            {/* Correctly redirects to the admin subdomain using a real browser navigation */}
            <Route path="/admin" element={<ExternalRedirect to="https://admin.organishi.com" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);