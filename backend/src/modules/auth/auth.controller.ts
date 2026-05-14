import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import logger from "../../utils/logger.js";
import { authService } from "./index.js";
import { ApiError } from "../../utils/ApiError.js";
import { loginUserData, registerUserData } from "./auth.validations.js";
import { comparePassword } from "../../utils/comparePassword.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";
import type { User } from "./auth.types.js";

const userSafe = (user: User) => {
  const {
    passwordHash,
    isDeleted,
    deletedAt,
    createdAt,
    updatedAt,
    ...safeUser
  } = user;

  return safeUser;
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Register Controller is working");

    const validateUser = registerUserData.safeParse(req.body);
    if (!validateUser.success) {
      const errors = validateUser.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ApiError(400, "Validation Failed", errors);
    }

    const isExist = await authService.findUserByEmail(req.body.email as string);
    if (isExist) {
      throw new ApiError(400, "User Already Exist");
    }

    const user = await authService.userRegisterService(req.body);
    const safeUser = userSafe(user);

    return res
      .status(201)
      .json(new ApiResponse(201, safeUser, "Register User Succesfully!"));
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Login Controller is working");

  const validateUser = loginUserData.safeParse(req.body);
  if (!validateUser.success) {
    throw new ApiError(400, "Validation Error", validateUser.error.issues);
  }

  const isExist = await authService.findUserByEmail(req.body.email);
  if (!isExist) {
    throw new ApiError(400, "User do not exist, please register first");
  }

  const isPasswordValid = await comparePassword(
    req.body.password,
    isExist.passwordHash
  );
  if (!isPasswordValid) {
    throw new ApiError(400, "Password was incorrect");
  }

  const accessToken = generateAccessToken(isExist.userId);
  const refreshToken = generateRefreshToken();

  const rawData = {
    userId: isExist.userId,
    email: req.body.email,
    refreshToken,
  };
  const user = await authService.userLoginService(rawData);

  if (!user.result) {
    throw new ApiError(400, "User not found");
  }
  const safeUser = userSafe(user.result);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .json(
      new ApiResponse(200, { accessToken, safeUser }, "Login Successfully!")
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Log out controller is working");
  const accessToken = req.accessToken as string;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh Token was not found");
  }

  if (!req.user?.userId) {
    throw new ApiError(400, "Unauthorized");
  }
  const id = req.user?.userId;

  await authService.blackListToken(accessToken, id);
  const deleteSession = await authService.removeSession(refreshToken);
  if (!deleteSession) {
    throw new ApiError(400, " Session was not found");
  }

  return res
    .status(200)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Hello", "User Logout succesfully!"));
});

export const reGenerateTokens = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Re-generate Token controller is working");

    // get token from cookies
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new ApiError(400, "RefreshToken was not found");
    }

    // find authsession in db and check that tokens were valid or not expiores or not
    const session = await authService.findSessionByToken(token);
    if (!session) {
      throw new ApiError(400, "Session was expired");
    }

    // find user from details check if user was deleted or not also isActive or not
    const user = await authService.findUserById(session.userId);
    if (!user) {
      throw new ApiError(400, "User was not Found");
    }

    // generate access and refresh token for user
    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken();
    if (!accessToken || !refreshToken) {
      throw new ApiError(400, "Failed to generate Tokens");
    }

    // update fields in authsession for user uppdate with new expiry and refresh token
    const updatedSession = await authService.updateSession(
      refreshToken,
      token,
      session.userId,
      session.id
    );
    if (updatedSession.count !== 1) {
      throw new ApiError(400, "Error while update in Database");
    }

    // set header to add accessTokens
    res.setHeader("new-access-token", accessToken);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, accessToken, "Tokens were re-generated!"));
  }
);

export const me = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Fetch User Details Controller is working")
  const user = req.user
  if(!user) {
    throw new ApiError(400, "User not found")
  }

  const safeUser = userSafe(user)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        safeUser,
        "Fetch User Details Succesfully!"
      )
    );
});
