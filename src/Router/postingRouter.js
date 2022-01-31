import express from "express";
import { see, getUpload, postUpload, deletePosting } from "../Controller/postingController";
import { protectMiddleware } from "../middlewares";

const postingRouter = express.Router();

postingRouter.route("/upload").all(protectMiddleware).get(getUpload).post(postUpload);
postingRouter.get("/:id", see);
postingRouter.get("/:id/delete", deletePosting);

export default postingRouter;