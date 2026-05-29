import { Router } from "express";
import authRouter from "./auth.route.js";
import blogRouter from "./blog.route.js";
import commentRouter from "./comment.route.js"

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
  {
    path: "/blog",
    route: blogRouter,
  },
  {
    path: "/comment",
    route: commentRouter
  }
];

defaultRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
