import mongoose, { mongo } from "mongoose";

const commentSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },

    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timeStamps : true})

export const Comment = mongoose.model("Comment",commentSchema)