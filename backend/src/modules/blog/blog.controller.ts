import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import logger from "../../utils/logger.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { blogService } from "./index.js";
import { requireUser } from "../../utils/requireUser.js";

export const allBlogs = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Fetch All Blogs Controller is working");

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  const getAllBlogs = await blogService.getAllBlogs(page, limit);
  if (!getAllBlogs) {
    throw new ApiError(500, "Failed to fetch blogs!");
  }
  const blogs = {
    blogsData: getAllBlogs[0],
    totalDocuments: getAllBlogs[1],
    page,
    limit,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "All Blogs fetched succesfully!"));
});

export const fetchBlogById = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Get blog by id controller is working");
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "ID was not found");
    }

    const blog = await blogService.getBlogById(id as string, {
      publishedOnly: true,
    });
    if (!blog) {
      throw new ApiError(404, "Blog was not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, blog, "Fetch blog succesfully!"));
  }
);

export const postBlog = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Post New Blog Controller is Working");
  requireUser(req);
  const body = req.body;
  const user = req.user;

  const duplicateSlug = await blogService.checkUniqueSlug(body.slugDisplay);
  if (duplicateSlug.result) {
    throw new ApiError(409, "Slug was taken try different slug");
  }

  const createPost = await blogService.createBlog(
    body,
    duplicateSlug.slug,
    user.userId
  );
  if (!createPost) {
    throw new ApiError(500, "Failed to create Post");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createPost, "Blog created successfully"));
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Update Blog Controller is working");
  requireUser(req);

  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "ID was not provided of Blog");
  }

  if (Object.keys(req.body).length === 0) {
    throw new ApiError(400, "There is nothing to update");
  }

  const user = req.user;

  const blog = await blogService.getBlogById(id as string);
  if (!blog) {
    throw new ApiError(404, "Blog was not found");
  }

  if (blog.authorId !== user.userId) {
    throw new ApiError(403, "Only Author of this Blog can edit Blog");
  }

  if (req.body.slugDisplay) {
    const isUnique = await blogService.checkUniqueSlug(req.body.slugDisplay, id as string);
    if (isUnique.result) {
      throw new ApiError(409, "Slug was taken try different slug");
    }
    req.body.slug = isUnique.slug;
  }

  const editedBlog = await blogService.blogUpdate(id as string, req.body);

  if (!editedBlog) {
    throw new ApiError(500, "Failed to update Blog in server");
  }

  if (
    req.body.isPublished !== undefined &&
    Object.keys(req.body).length === 1
  ) {
    return res
      .status(200)
      .json(new ApiResponse(200, editedBlog, "Blog's publishing was changed"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, editedBlog, "Blog Updated succesfully!"));
});

export const removeBlog = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Delete Blog Controller is working");
  requireUser(req);

  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Which Blog you want to delete");
  }

  const user = req.user;

  const fetchBlog = await blogService.getBlogById(id as string);
  if (!fetchBlog) {
    throw new ApiError(500, "Failed to detect Blog for delete");
  }

  if (fetchBlog.authorId !== user.userId) {
    throw new ApiError(400, "Only Author of this Blog can delete this Blog");
  }

  const deleteBlog = await blogService.deleteBlog(id as string);
  if (!deleteBlog) {
    throw new ApiError(500, "Failed to delete Blog , try again");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteBlog, "Blog Deleted Succesfully"));
});

export const blogsOfAuthor = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Get Blogs of Specific Author");
    requireUser(req);

    const user = req.user;

    const allBlogsOfAuthor = await blogService.authorBlogs(user.userId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allBlogsOfAuthor,
          "fetch all blogs of author succesfully"
        )
      );
  }
);

export const fetchAuthorBlogById = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Get Author Blog by Id");
    requireUser(req);
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "ID was not provided of Blog");
    }

    const user = req.user;

    const getAuthorBlog = await blogService.findAuthorBlogById(
      user.userId,
      id as string
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, getAuthorBlog, "Fetch Blog Details for Update it.")
      );
  }
);
