import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://image-gallery-backend-plum.vercel.app/api", 
  // baseURL: "http://localhost:5001/api", 
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional: Handles Unauthorized Access)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., logout user)
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
