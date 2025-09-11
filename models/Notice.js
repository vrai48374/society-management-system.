import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
    {
        title:{type:String,required:true},
        message:{type:String,required:true},
        society:{type:mongoose.Schema.ObjectId,ref:"Society",required:true},
        createdBy:{type:mongoose.Schema.ObjectId,ref:"User",required:true},
        sendTo:[{type:mongoose.Schema.ObjectId,ref:"User"}],
        createdAt:{type:Date,default:Date.now}
    }
);

export default mongoose.model("Notice",noticeSchema);