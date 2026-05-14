import express, { Router } from "express";
import authRouter from "./auth.route.js";

const router: Router = Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultRoutes: IRoute[] = [
  {
    path: "/auth",
    route: authRouter,
  },
];

defaultRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
