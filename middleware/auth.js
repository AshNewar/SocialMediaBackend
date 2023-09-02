import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticated = async (req, res,next) => {
  try {
    const {token} =req.cookies;
    console.log(token);
    if(!token){
      return res.status(401).json({ success:false,message: 'You are not logged in' });
    }
    const verifiedId=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(verifiedId.id);
    next();

  } catch (error) {
    console.log(error);
  }
};
