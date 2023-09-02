import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { getProfile, getUser, getUserFriends, updateFriends } from '../controllers/userFunc.js';

const userRoute=express.Router();

userRoute.get("/:id",isAuthenticated,getUser);
userRoute.get("/:id/friends",isAuthenticated,getUserFriends);
userRoute.get("/me/profile",isAuthenticated,getProfile);

userRoute.get("/:id/:friendId",isAuthenticated,updateFriends);

export default userRoute;