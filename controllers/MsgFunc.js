import Msg from "../models/msg.js";

export const getAllMsg = async (req, res) => {
    try {
        const { sender, receiver } = req.body;
        const msg = await Msg.find({
            users: {
                $all: [sender._id, receiver._id],
            }
        }).sort({ updatedAt: 1 });
        const mapMsg = msg.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === sender._id,
                message: msg.message.text,
            }

        });
        res.status(200).json({ success: true, mapMsg });
    } catch (error) {
        console.log(error);

    }

}

export const newMsg = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;
        // console.log(sender,receiver);
        const data = await Msg.create({
            message: { text: message },
            users: [sender._id, receiver._id],
            sender: sender._id,
        })
        if (data) {
            return res.status(200).json({ success: true, msg: "Msg Added" })
        }
        return res.status(404).json({ success: false, msg: "Failed" });
    } catch (error) {
        console.log(error);
    }

}