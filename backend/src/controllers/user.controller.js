// user.controller.js
import User from "../models/user.model.js";
import { Message } from "../models/message.model.js"
export const getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // CALL AS FUNCTION
    const users = await User.find({ clerkId: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req,res,next)=>{
  try {
    const {userId:myId}= req.auth();
    const {userId}=req.params;

    const messages = await Message.find({
      $or:[
        {senderId:myId, receiverId:userId},
        {senderId:userId, receiverId:myId},
      ]
    }).sort({createdAt : 1});
    res.status(200).json(messages);
   

  } catch (error) {
    next(error);
  }
}