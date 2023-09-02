import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getAllPost, getUserPost, likePost } from "../controllers/postFunc.js";

const postRoute=express.Router();

postRoute.get("/",isAuthenticated,getAllPost);
postRoute.get("/:id/posts",isAuthenticated,getUserPost);
postRoute.get("/:postId/likes",isAuthenticated,likePost);





export default postRoute;