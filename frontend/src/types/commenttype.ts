import type z from "zod";
import type { commentSchema } from "../validations/commentSchema";

export type commentData = {
  message: string;
};

export type comment = {
  commentId: string;
  postId: string;
  message: string;
  createdAt: Date;
  user: userD;
};

export type userD = {
  firstName: string;
  lastName: string;
};

export type commentResponse = comment[];

export type commentApiData = z.infer<typeof commentSchema>;
