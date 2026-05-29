import type { commentApiData } from "../types/commenttype";
import { api } from "./axios";

export const postComment = (data : commentApiData) => api.post(`/comment/msg`, data);

export const getComment = (id: string, page: number) =>
  api.get(`/comment/${id}?page=${page}`);
