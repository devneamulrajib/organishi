import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import Admin from './Admin';
import Login from './Login';

function App() {
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);

  useEffect(() => {
    // Check if the current URL starts with "admin."
    const host = window.location.hostname;
    if (host.startsWith('admin.')) {
      setIsAdminSubdomain(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* If user is on admin.yourdomain.com */}
        {isAdminSubdomain ? (
          <>
            <Route path="/" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            {/* Redirect any other path to admin root */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* If user is on the main yourdomain.com */
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Navigate to="https://admin.organishi.com" />} />
            {/* Add your other shop routes here */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;