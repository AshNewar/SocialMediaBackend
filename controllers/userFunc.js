import User from "../models/user.js";
export const getProfile = async (req, res) => {
  try {
  res.status(200).json({ success: true });

    
  } catch (error) {
    console.log("Error");
    
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "User not found" });

    const friends = await Promise.all(
      user.friends.map(async (friend) => {
        return await User.findById(friend);
      })
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json({ formattedFriends });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

//update friends

export const updateFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    if (!user)
      return res
        .status(500)
        .json({ success: false, message: "User not found" });

    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map(async (friend) => {
        return await User.findById(friend);
      })
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json({ formattedFriends });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
};
