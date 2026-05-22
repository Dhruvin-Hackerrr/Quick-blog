import z from "zod";
import type { publishBlogValidation, updateBlogValidation } from "../validations/blogSchema";
import type { CategoryType } from "../../../shared/category";

export type publishBlogData = z.infer<typeof publishBlogValidation>;
export type updateBlogData = z.infer<typeof updateBlogValidation>;


export type blogType = publishBlogData & {
    postId : string,
    authorId : string,
    category : CategoryType,
    createdAt: Date,
    deletedAt: Date,
    editCount: number,
    isDeleted: boolean,
    isEdited: boolean,
    isPublished: boolean,
    updatedAt : Date,
    comments: Array<comment>
  }
  
  export type comment = {
      commentId : string,
      message: string,
      postId: string,
      user : Array<users>,
      createdAt : Date
  }
  
  export type users = {
    firstName : string,
    lastName : string
  }