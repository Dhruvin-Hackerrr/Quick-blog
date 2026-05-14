import type { loginFormData, registerFormData } from "../validations/authSchema";
import { api } from "./axios";

export const registerUser = (data : registerFormData) => api.post(`/auth/new`, data);

export const loginUser = (data : loginFormData) => api.post(`/auth/login`, data)

export const fetchUser = () => api.get(`/auth/me`);

export const logoutUser = () => api.post(`/auth/logout`);
