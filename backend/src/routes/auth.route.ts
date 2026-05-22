import { Router } from "express";
import { authController } from "../modules/auth/index.js";
import { isUserAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../utils/validate.js";
import { loginUserData, registerUserData } from "../modules/auth/auth.validations.js";

const router: Router = Router();

router.route("/new").post(validate(registerUserData),authController.registerUser);
router.route("/login").patch(validate(loginUserData),authController.loginUser);
router.route("/logout").patch(isUserAuthenticated, authController.logoutUser);
router.route("/me").get(isUserAuthenticated, authController.me);

router.route("/refresh").post(authController.reGenerateTokens);

export default router;
