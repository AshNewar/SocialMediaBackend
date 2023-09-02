import express from 'express';
// import { getAllUser, newUser } from '../controllers/userFunc.js';
import { getAllMsg, newMsg } from '../controllers/MsgFunc.js';

const chatRouter = express.Router();
chatRouter.post("/getmsg/", getAllMsg)
chatRouter.post("/addmsg/", newMsg);
export default chatRouter;  