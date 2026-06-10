import axios from 'axios';

const isLocal = import.meta.env.DEV;

const API = axios.create({
  baseURL: isLocal
    ? 'http://localhost:5000/api'
    : 'https://organishi-backend.onrender.com/api'
});

export const BASE_URL = isLocal
  ? 'http://localhost:5000'
  : 'https://organishi-backend.onrender.com';

// Smart image URL helper — use this instead of `${BASE_URL}${img}` everywhere
// If the URL is already a full URL (Cloudinary), use it as-is
// If it's a legacy /uploads path, prepend BASE_URL
export const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;       // Cloudinary full URL
  return `${BASE_URL}${path}`;                    // legacy /uploads/... path
};

export default API;