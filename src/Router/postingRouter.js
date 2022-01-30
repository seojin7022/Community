import express from "express";
import { see, getUpload, postUpload, deletePosting } from "../Controller/postingController";

const postingRouter = express.Router();

postingRouter.route("/upload").get(getUpload).post(postUpload);
postingRouter.get("/:id", see);
postingRouter.get("/:id/delete", deletePosting);

export default postingRouter;