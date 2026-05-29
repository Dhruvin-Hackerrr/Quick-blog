import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import logger from "../../utils/logger.js";
import { requireUser } from "../../utils/requireUser.js";
import { commentService } from "./index.js";

import { ApiError } from "../../utils/ApiError.js";
import { io } from "../../app.js";
import type { commentType, DBcomment, DBcomments } from "./comment.types.js";
import { blogService } from "../blog/index.js";
import { safeComment } from "./comment.constants.js";

export const leaveComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Leave commment controller is working ");
    requireUser(req);

    const commentData: commentType = { ...req.body, userId: req.user.userId };

    const response = await commentService.sendComment(commentData);
    if (!response) {
      throw new ApiError(500, "Failed to leave comment");
    }

    const updateCount = await blogService.addCommentCountInPost(req.body.postId)
    if(!updateCount) {
      throw new ApiError(500, "Comment count do not increase!")
    }

    const comment = safeComment(response);

    io.to(`${comment.postId}`).emit("comment:receive", comment);

    return res
      .status(200)
      .json(new ApiResponse(200, {comment, updateCount}, "Comment on this post"));
  }
);

export const fetchComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Fetch Comments controller is working");
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Blog Id was not found");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const response = await commentService.getComments(
      id as string,
      limit,
      skip
    );
    if (!response) {
      throw new ApiError(500, "Error while fetching Comments");
    }

    const loadcomments = response[0].map((cmt) => {
      const safeCmt = safeComment(cmt);
      return safeCmt;
    });

    const comments = {
      loadedComments: loadcomments,
      totalComments: response[1],
      hasMore: skip + response[0].length < response[1],
      page: page,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Fetch Comments successfully!"));
  }
);
