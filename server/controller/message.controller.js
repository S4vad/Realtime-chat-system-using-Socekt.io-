import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { uploadCloudinary } from "../confilg/cloudinary.js";
import fs from "fs";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const { message } = req.body;

    let image;
    if (req.file) {
      image = await uploadCloudinary(req.file.path);
      console.log("the imag cloudinary", image);
      // Optional: delete local file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.params;
    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate("messages");

    if (!conversation) {
      return res.status(400).json({ message: "conversation not found" });
    }
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
