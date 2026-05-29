import z from "zod";
import type { commentValidation } from "./comment.validations.js";

export type DBcomment = {
  commentId: string;
  postId: string;
  userId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
};

export type DBcomments = DBcomment[];

export type commentType = z.infer<typeof commentValidation> & {
  userId: string;
};
