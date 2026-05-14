import axios from "axios";
import {
  clearAccessToken,
  getAccesToken,
  setAccessToken,
} from "../utils/localStorage";

const BASE_URL = "http://localhost:5000/api/v1";

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
  (res) => {
    const token = res.headers["new-access-token"];
    if (token) {
      clearAccessToken();
      setAccessToken(token);
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        console.log(response);

        const newAccessToken = response.data.data;
        console.log(newAccessToken);

        clearAccessToken();

        setAccessToken(newAccessToken);

        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // optional: log or send to monitoring
    console.error("API Error:", message);

    return Promise.reject(new Error(message));
  }
);
