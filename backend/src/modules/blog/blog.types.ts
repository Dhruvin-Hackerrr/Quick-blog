import type { Category } from "@prisma/client";

export type BlogDocument = {
  title: string;
  slug: string;
  slugDisplay: string;
  body: any;
  postId: string;
  authorId: string;
  category: Category;
  createdAt: Date;
  deletedAt: Date | null;
  editCount: number;
  isDeleted: boolean;
  isEdited: boolean;
  isPublished: boolean;
  updatedAt: Date;
  commentsCount: number;
  author?: authorDocument;
};

export type authorDocument = {
  firstName: string;
  lastName: string;
};
