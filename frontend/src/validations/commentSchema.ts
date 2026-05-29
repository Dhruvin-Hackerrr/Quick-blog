import z from "zod";

export const commentSchema = z.object({
  message: z
    .string()
    .trim()
    .max(500, "Comment does not contain more then 500 characters"),

  postId: z.string().uuid({ message: "Invalid Post id" }),
});
