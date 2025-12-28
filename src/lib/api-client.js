// Axios instance untuk imuii-server Template Uploader API
import axios from "axios";

// Helper untuk normalize base URL
function normalizeBaseURL(url) {
  // Default: production API server
  if (!url) {
    // Production: https://api.imuii.id/api/v1
    // Development: bisa override dengan NEXT_PUBLIC_API_SERVER_URL
    if (process.env.NODE_ENV === "production") {
      return "https://api.imuii.id/api/v1";
    }
    return "http://localhost:8080/api/v1";
  }
  
  url = url.trim().replace(/\/+$/, "");
  
  // Jika URL tidak memiliki protocol, tambahkan https untuk production
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (process.env.NODE_ENV === "production") {
      url = "https://" + url;
    } else {
      url = "http://" + url;
    }
  }
  
  if (url.endsWith("/api/v1")) {
    return url;
  }
  
  if (!url.endsWith("/api/v1")) {
    if (!url.endsWith("/")) {
      url += "/";
    }
    url += "api/v1";
  }
  
  return url;
}

const apiClient = axios.create({
  baseURL: normalizeBaseURL(process.env.NEXT_PUBLIC_API_SERVER_URL),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor - attach JWT token dari localStorage
apiClient.interceptors.request.use(
  (config) => {
    let token = null;
    
    if (typeof window !== "undefined") {
      token = localStorage.getItem("uploader-token");
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle error format
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const errorData = error.response.data;
      console.error("API Error:", error.response.status, errorData);
      
      const transformedError = {
        ...error,
        message: errorData?.message || error.message,
        error: errorData?.error || errorData?.message,
        code: error.response.status,
      };
      
      return Promise.reject(transformedError);
    } else if (error.request) {
      console.error("Network Error:", error.request);
      return Promise.reject({
        ...error,
        message: "Network error: Tidak dapat terhubung ke server",
        code: 0,
      });
    } else {
      console.error("Error:", error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;

