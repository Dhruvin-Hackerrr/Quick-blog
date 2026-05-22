import type { loginFormData, registerFormData } from "../types/authtype";
import { api } from "./axios";

export const registerUser = (data : registerFormData) => api.post(`/auth/new`, data);

export const loginUser = (data : loginFormData) => api.patch(`/auth/login`, data)

export const fetchUser = () => api.get(`/auth/me`);

export const logoutUser = () => api.patch(`/auth/logout`);
