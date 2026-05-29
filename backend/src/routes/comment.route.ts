import { Router } from "express";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import { commentController } from "../modules/comment/index.js";
import { validate } from "../utils/validate.js";
import { commentValidation } from "../modules/comment/comment.validations.js";

const router: Router = Router();

router
  .route("/msg")
  .post(
    isUserAuthenticated,
    validate(commentValidation),
    commentController.leaveComment
  );
router.route("/:id").get(commentController.fetchComments)

export default router;
