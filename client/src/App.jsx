import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage'; // Your main shop page
import Admin from './Admin';
import Login from './Login';

function App() {
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the current URL starts with "admin."
    const host = window.location.hostname;
    
    // This handles both local testing (admin.localhost) and production (admin.organishi.com)
    if (host.startsWith('admin.') || host.includes('admin')) {
      setIsAdminSubdomain(true);
    }
    setLoading(false);
  }, []);

  if (loading) return null; // Wait for the check to finish

  return (
    <BrowserRouter>
      <Routes>
        {isAdminSubdomain ? (
          /* ── ADMIN SUBDOMAIN ROUTES ── */
          <>
            <Route path="/" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            {/* Redirect everything else on this subdomain to Admin root */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* ── MAIN SHOP ROUTES ── */
          <>
            <Route path="/" element={<HomePage />} />
            {/* If someone types /admin on the main site, send them to the subdomain */}
            <Route path="/admin" element={<Navigate to="https://admin.organishi.com" />} />
            <Route path="/login" element={<Login />} />
            
            {/* Add your other shop routes here like /products, /about, etc. */}
            {/* <Route path="/products" element={<ProductsPage />} /> */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;