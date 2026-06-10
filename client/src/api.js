import React, { useState } from 'react';
import API from './api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [data, setData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', { 
        username: data.username, 
        password: data.password 
      });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err) {
      alert("Invalid Login Details. Check your .env file credentials.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f3f4f6] font-sans">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-3xl shadow-2xl w-96">
        <h2 className="text-3xl font-black mb-2 text-gray-800 uppercase tracking-tighter">Admin Login</h2>
        <p className="text-gray-500 mb-6 text-sm">Enter your credentials from the .env file</p>
        
        <div className="space-y-4">
          <input 
            className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-black transition" 
            placeholder="Username" 
            onChange={e => setData({...data, username: e.target.value})} 
          />
          <input 
            className="w-full border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-black transition" 
            type="password" 
            placeholder="Password" 
            onChange={e => setData({...data, password: e.target.value})} 
          />
          <button 
            type="submit"
            className="w-full bg-black text-white p-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg">
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;