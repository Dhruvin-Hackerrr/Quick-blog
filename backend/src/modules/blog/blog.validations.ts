import z from "zod";
import { Category } from "@prisma/client";

export const postBlogValidation = z.object({
  title: z
    .string()
    .min(10, "Title must contain atleast 10 characters")
    .max(35, "Title length would not be more then 35 characters"),

  slugDisplay: z
    .string()
    .min(8, "Slug must contain atleast 8 characters")
    .max(30, "Slug length would not be more then 30 characters")
    .regex(
      /^[a-zA-Z0-9 ,.:%'?$#&]+$/,
      "Slug can only contain letters, numbers, comma, dot, colon, %, ?, $, #, @, ', &"
    ),

  body: z.any().refine(
    (value) => {
      // Flatten all text nodes
      const text = value?.content
        ?.map((node: any) =>
          node?.content?.map((child: any) => child?.text || "").join("")
        )
        .join("")
        .trim();

      // Count words
      const wordCount = text ? text.split(/\s+/).length : 0;

      return wordCount >= 50; // minimum 50 words
    },
    {
      message: "Blog must contain at least 50 words",
    }
  ),

  category: z.nativeEnum(Category),
});

export const updateBlogValidation = postBlogValidation.partial().extend({
  isPublished: z.boolean().optional(),
});

export type postBlogData = z.infer<typeof postBlogValidation>;

export type updateBlogData = z.infer<typeof updateBlogValidation>;
