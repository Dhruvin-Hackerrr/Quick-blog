import type { DBcomment } from "./comment.types.js";

export const safeComment = (comment: DBcomment) => {
    const { userId, updatedAt, isDeleted, deletedAt, ...filterComment } = comment;
    return filterComment;
  };