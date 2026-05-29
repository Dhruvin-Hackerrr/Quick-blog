import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import logger from "../../utils/logger.js";
import { authService } from "./index.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword } from "../../utils/comparePassword.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";
import { requireUser } from "../../utils/requireUser.js";
import { REFRESH_TOKEN_EXPIRY, userSafe } from "./auth.constants.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Register Controller is working");

    const isExist = await authService.findUserByEmail(req.body.email as string);
    if (isExist) {
      throw new ApiError(409, "User Already Exist");
    }

    const user = await authService.userRegisterService(req.body);
    if(!user) {
      throw new ApiError(500, "User not Registered")
    }
    const safeUser = userSafe(user);

    return res
      .status(201)
      .json(new ApiResponse(201, safeUser, "Register User Succesfully!"));
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Login Controller is working");

  const isExist = await authService.findUserByEmail(req.body.email);
  if (!isExist) {
    throw new ApiError(404, "User do not exist, please register first");
  }

  const isPasswordValid = await comparePassword(
    req.body.password,
    isExist.passwordHash
  );
  if (!isPasswordValid) {
    throw new ApiError(401, "Password was incorrect");
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
    throw new ApiError(500, "Failed to login User");
  }
  const safeUser = userSafe(user.result);

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: REFRESH_TOKEN_EXPIRY,
    })
    .json(
      new ApiResponse(200, { accessToken, safeUser }, "Login Successfully!")
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Log out controller is working");
  const accessToken = req.accessToken as string;
  const refreshToken = req.cookies.refreshToken;
  requireUser(req);
  const user = req.user;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh Token was not found");
  }
  const id = user.userId;

  await authService.blackListToken(accessToken, id);
  const deleteSession = await authService.removeSession(refreshToken);
  if (deleteSession.count === 0) {
    logger.warn("Session already removed or expired");
  }

  return res
    .status(200)
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User Logout succesfully!"));
});

export const reGenerateTokens = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info("Re-generate Token controller is working");

    // get token from cookies
    const token = req.cookies.refreshToken;
    if (!token) {
      throw new ApiError(401, "RefreshToken was not found");
    }

    // find authsession in db and check that tokens were valid or not expiores or not
    const session = await authService.findSessionByToken(token);
    if (!session) {
      throw new ApiError(404, "Session was expired or not found");
    }

    // find user from details check if user was deleted or not also isActive or not
    const user = await authService.findUserById(session.userId);
    if (!user) {
      throw new ApiError(404, "User was not Found");
    }

    // generate access and refresh token for user
    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken();
    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Failed to generate Tokens");
    }

    // update fields in authsession for user uppdate with new expiry and refresh token
    const updatedSession = await authService.updateSession(
      refreshToken,
      token,
      session.userId,
      session.id
    );
    if (updatedSession.count !== 1) {
      throw new ApiError(500, "Error while update in Database");
    }

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
  logger.info("Fetch User Details Controller is working");
  requireUser(req);

  const user = req.user;

  const safeUser = userSafe(user);

  return res
    .status(200)
    .json(new ApiResponse(200, safeUser, "Fetch User Details Succesfully!"));
});
