import { Router } from "express";
import authRouter from "./auth.route.js";
import blogRouter from "./blog.route.js";

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
];

defaultRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
