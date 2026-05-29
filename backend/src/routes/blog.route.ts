import { Router } from "express";
import { blogController } from "../modules/blog/index.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";
import { UserRole } from "@prisma/client";
import { validate } from "../utils/validate.js";
import { postBlogValidation, updateBlogValidation } from "../modules/blog/blog.validations.js";
import { optionalUserAuth } from "../middlewares/optionalUserAuth.js";

const router: Router = Router();

router.route("/").get(blogController.filterBlogs)
router.route("/me").get(isUserAuthenticated, authorize(UserRole.AUTHOR), blogController.blogsOfAuthor)
router.route("/:id").get(optionalUserAuth,blogController.fetchBlogById);
router.route("/preview/:id").get(isUserAuthenticated, authorize(UserRole.AUTHOR), blogController.fetchAuthorBlogById)
router
  .route("/publish")
  .post(isUserAuthenticated, authorize(UserRole.AUTHOR), validate(postBlogValidation), blogController.postBlog);
router
  .route("/edit/:id")
  .patch(isUserAuthenticated, authorize(UserRole.AUTHOR),validate(updateBlogValidation), blogController.updateBlog);
router
  .route("/delete/:id")
  .patch(isUserAuthenticated, authorize(UserRole.AUTHOR), blogController.removeBlog);

export default router;
