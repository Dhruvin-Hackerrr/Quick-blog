import type { publishBlogData, updateBlogData } from "../types/blogtype";
import { api } from "./axios";

export const fetchFilteredBlog = (page : number,search, category) => api.get(`/blog?search=${search}&category=${category}&page=${page}`)

export const fetchBlogById = (id: string) => api.get(`/blog/${id}`);

export const fetchAuthorBlogById = (id: string) => api.get(`/blog/preview/${id}`);

export const publishBlog = (data : publishBlogData) => api.post(`/blog/publish`, data);

export const updateblog = (data : updateBlogData, id: string) =>
  api.patch(`/blog/edit/${id}`, data);

export const removeBlog = (id: string) => api.patch(`/blog/delete/${id}`);

export const myBlogs = (page: number) => api.get(`/blog/me?page=${page}`);
