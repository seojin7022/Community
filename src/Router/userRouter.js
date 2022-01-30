import express from "express";
import { startKakaoLogin, finishKakaoLogin } from "../Controller/userController";

const userRouter = express.Router();

userRouter.get("/kakao/start", startKakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);

export default userRouter;