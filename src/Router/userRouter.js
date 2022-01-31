import express from "express";
import { startKakaoLogin, finishKakaoLogin, getEdit, postEdit, getChangePassword, postChangePassword } from "../Controller/userController";
import { protectMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/edit").all(protectMiddleware).get(getEdit).post(postEdit);
userRouter.route("/edit/password").all(protectMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/kakao/start",publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish",publicOnlyMiddleware, finishKakaoLogin);

export default userRouter;