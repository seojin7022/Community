import express from "express";
import { home, search } from "../Controller/postingController";
import { getJoin, getLogin, postJoin, postLogin, logout } from "../Controller/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/logout", logout);

export default rootRouter;