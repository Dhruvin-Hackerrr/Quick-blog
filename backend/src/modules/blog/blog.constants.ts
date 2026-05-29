import type { BlogDocument } from "./blog.types.js";

export const safeBlog = (blog: BlogDocument) => {
  const { isDeleted, deletedAt, isEdited, editCount, slug, ...filterBlog } =
    blog;

  return filterBlog;
};
