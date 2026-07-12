import axios from "axios";

// =====================================================
// Axios Instance
// =====================================================

const API = axios.create({
  baseURL: "/api/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// JWT Token
// =====================================================

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};

// =====================================================
// Automatically attach token
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// Handle Unauthorized
// =====================================================

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;