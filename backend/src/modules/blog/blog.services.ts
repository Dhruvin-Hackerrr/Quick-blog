import { prisma } from "../../config/database.js";
import { commentSelect } from "./blog.constants.js";
import type { postBlogData, updateBlogData } from "./blog.validations.js";

export const checkUniqueSlug = async (data: string, id?: string) => {
  const slug = data
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-")
    .replace(/-+/g, "-");
  const result = await prisma.post.findFirst({
    where: { slug: slug, isDeleted: false, ...(id && { NOT: { postId: id } }) },
  });

  return { result, slug };
};

export const getAllBlogs = async (page: number, limit: number) => {
  return Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        isDeleted: false,
        isPublished: true,
      },
      include: {
        comments: {
          where: {
            isDeleted: false,
          },
          select: commentSelect,
          orderBy: {
            createdAt: "desc",
          },
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.post.count({
      where: {
        isDeleted: false,
        isPublished: true,
      },
    }),
  ]);
};

export const getBlogById = async (
  id: string,
  options?: { publishedOnly: boolean }
) => {
  const result = await prisma.post.findFirst({
    where: {
      postId: id,
      isDeleted: false,
      ...(options?.publishedOnly && {
        isPublished: true,
      }),
    },
    include: {
      comments: {
        where: {
          isDeleted: false,
        },
        select: commentSelect,
        orderBy: {
          createdAt: "desc",
        },
      },
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return result;
};

export const createBlog = async (
  data: postBlogData,
  slug: string,
  id: string
) => {
  const result = await prisma.post.create({
    data: {
      title: data.title,
      slug: slug,
      slugDisplay: data.slugDisplay,
      body: data.body,
      category: data.category,
      authorId: id,
    },
  });

  return result;
};

export const blogUpdate = async (id: string, newdata: updateBlogData) => {
  const filteredData = Object.fromEntries(
    Object.entries(newdata).filter(([_, value]) => value !== undefined)
  );

  const contentFields = ["title", "slug", "body"];

  const isContentUpdated: boolean = contentFields.some(
    (field) => field in filteredData
  );

  const result = await prisma.post.update({
    where: { postId: id },
    data: {
      ...filteredData,
      ...(isContentUpdated && {
        isEdited: true,
        editCount: {
          increment: 1,
        },
      }),
    },
    include: {
      comments: {
        where: {
          isDeleted: false,
        },
        select: commentSelect,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return result;
};

export const deleteBlog = async (id: string) => {
  const result = await prisma.post.update({
    where: {
      postId: id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
  return result;
};

export const authorBlogs = async (id: string) => {
  const result = await prisma.post.findMany({
    where: { authorId: id, isDeleted: false },
    include: {
      comments: {
        where: {
          isDeleted: false,
        },
        select: commentSelect,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const findAuthorBlogById = async (authorid: string, id: string) => {
  const result = await prisma.post.findFirst({
    where: {
      postId: id,
      authorId: authorid,
      isDeleted: false,
    },
  });

  return result;
};
