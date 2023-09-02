import express from "express";
import { userLogin } from "../controllers/registerFunc.js";

const authroute=express.Router();

authroute.post("/login",userLogin);

export default authroute;