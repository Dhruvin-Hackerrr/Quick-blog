import { prisma } from "../../config/database.js";
import type { commentType } from "./comment.types.js";

export const sendComment = async (data: commentType) => {
  const result = await prisma.comment.create({
    data: { postId: data.postId, message: data.message, userId: data.userId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return result;
};

export const getComments = async (id: string, limit: number, skip: number) => {
  return Promise.all([
    prisma.comment.findMany({
      where: { postId: id },
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),

    prisma.comment.count({
      where: {
        isDeleted: false,
        postId: id,
      },
    }),
  ]);
};