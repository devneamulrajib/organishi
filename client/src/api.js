import axios from 'axios';

// This checks if you are running 'npm run dev' (Local) or 'npm run build' (Production)
const isLocal = import.meta.env.DEV;

const API = axios.create({
  baseURL: isLocal 
    ? 'http://localhost:5000/api' 
    : 'https://organishi-backend.onrender.com/api' // <--- REPLACE this URL with your actual Render URL later
});

// We also export the Base URL for images
export const BASE_URL = isLocal 
    ? 'http://localhost:5000' 
    : 'https://organishi-backend.onrender.com'; // <--- REPLACE this too

export default API;