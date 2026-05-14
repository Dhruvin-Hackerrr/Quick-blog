import { Router } from "express";
import { authController } from "../modules/auth/index.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";

const router: Router = Router();

router.route("/new").post(authController.registerUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").post(isUserAuthenticated, authController.logoutUser);
router.route("/me").get(isUserAuthenticated, authController.me);

router.route("/refresh").post(authController.reGenerateTokens);

export default router;
