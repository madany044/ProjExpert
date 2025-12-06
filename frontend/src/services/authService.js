import axios from 'axios';

// Use cookie-based auth: send credentials so httpOnly session cookie is included
const API = axios.create({ baseURL: '/api', withCredentials: true });

export default API;
