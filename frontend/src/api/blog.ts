import { api } from "./axios";

export const fetchBlogs = (page, limit) =>
  api.get(`/blog?page=${page}&limit=${limit}`);

export const fetchBlogById = (id: string) => api.get(`/blog/${id}`);

export const fetchAuthorBlogById = (id: string) => api.get(`/blog/edit/${id}`);

export const publishBlog = (data) => api.post(`/blog/publish`, data);

export const updateblog = (data, id: string) =>
  api.patch(`/blog/edit/${id}`, data);

export const removeBlog = (id: string) => api.patch(`/blog/delete/${id}`);

export const myBlogs = () => api.get(`/blog/me`);
