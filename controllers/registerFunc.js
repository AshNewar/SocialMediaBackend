import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser ,message: 'User Registered Successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({success:false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success:false,message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+(60*100000)),
        sameSite:process.env.NODE_URI==="Development"?"lax":"none",
        secure:process.env.NODE_URI==="Development"?false:true,
    }).json({ success: true, token: token, user: user ,message:`Welcome Back ${user.firstName}`});
    
  } catch (error) {
    res.status(500).json({ success:false,message: error.message });
  }
};
