import axios from "axios";
import {
  clearAccessToken,
  getAccesToken,
  setAccessToken,
} from "../utils/localStorage";

const BASE_URL = "http://localhost:5000/api/v1";

let isRefreshing = false;
let failedQueue = [];

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccesToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message === "Access token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }

      try {
        isRefreshing = true;
        const response = await axios.post(
          "http://localhost:5000/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = response.data.data;

        setAccessToken(newAccessToken);

        failedQueue.forEach((req) => {
          req.originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          req.resolve(api(req.originalRequest));
        });

        failedQueue = [];

        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // optional: log or send to monitoring
    console.error("API Error:", message);

    return Promise.reject(new Error(message));
  }
);
