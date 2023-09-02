import Post from "../models/post.js";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, postPicturePath } = req.body;
    const user = await User.findById(userId);
    const post = await Post.create({
      userId: userId,
      firstName: user.firstName,
      lastName: user.lastName,

      description: description,
      postPicturePath: postPicturePath,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });
    await post.save();
    const posts = await Post.find();
    res.status(201).json({ posts });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ userId: id });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const {postId}  = req.params;
    const userId  = req.user.id;
    
    const post = await Post.findById(postId);
    console.log(post);
    const isLiked = post.likes.get(userId);
    console.log(isLiked);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json({ updatedPost });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
