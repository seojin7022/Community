import express from "express";
import { home, search } from "../Controller/postingController";
import { getJoin, getLogin, postJoin, postLogin, logout } from "../Controller/userController";
import { protectMiddleware, publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get("/logout",protectMiddleware, logout);

export default rootRouter;