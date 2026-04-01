import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
  senderId:{type:String,required:true}, // clerk userId
  receiverId:{type:String,required:true}, //clerk userId
  content:{type:String,required:true},
},
{timestamps:true});

export const Message=mongoose.model("Message",messageSchema);