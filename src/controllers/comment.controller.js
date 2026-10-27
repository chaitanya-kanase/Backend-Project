import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {Comment} from "../models/comment.model.js"
import {asyncHandeler} from "../utils/asyncHandeler.js"
import {Video} from "../models/video.model.js"


const getVideoComments = asyncHandeler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    const comments = await Comment.find({
        video: videoId
    })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const totalComments = await Comment.countDocuments({
        video: videoId
    });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                comments,
                pagination: {
                    page: pageNumber,
                    limit: limitNumber,
                    totalComments,
                    totalPages: Math.ceil(totalComments / limitNumber)
                }
            },
            "Comments fetched successfully"
        )
    );
});

const addComment = asyncHandeler(async(req,res)=>{
    const { content } = req.body
    const { videoId } = req.params

    if(typeof(content) !== "string" || !content.trim()){
        throw new apiError(400, "Content is required")
    }

    if(!mongoose.isValidObjectId(videoId)){
        throw new apiError(400,"Invalid video ID")
    }

    const video = await Video.findOne({
        _id : videoId, 
        isPublished : true
    })

    if(!video){
        throw new apiError(404,"Video not found")
    }


    const comment = await Comment.create({
        content ,
        owner : req.user._id,
        video : videoId
    })

    return res.status(201).json(
        new apiResponse(201, comment, "Comment created successfully")
    )
})

const updateComment = asyncHandeler(async(req,res)=>{
    const { commentId } = req.params
    const { content } = req.body


     if(!mongoose.isValidObjectId(commentId)){
        throw new apiError(400,"Invalid comment ID")
    }

    if(typeof(content) !== "string" || !content.trim()){
        throw new apiError(400, "Content is required")
    }

    const comment = await Comment.findOne({
        _id : commentId,
        owner : req.user._id
    })

    if(!comment){
        throw new apiError(404, "Comment not found")
    }

    comment.content  = content
    await comment.save()


    return res.status(200).json(
        new apiResponse(200, comment, "Comment updated successfully")
    )

})

const deleteComment= asyncHandeler(async(req,res)=>{
    const { commentId } = req.params

    if(!mongoose.isValidObjectId(commentId)){
        throw new apiError(400,"Invalid comment ID")
    }

    const comment = await Comment.findOneAndDelete({
        _id : commentId,
        owner : req.user._id
    })

    if(!comment){
        throw new apiError(404, "Comment not found")
    }

    return res.status(200).json(
        new apiResponse(200, comment, "Comment deleted successfully")
    )
})

export {getVideoComments,addComment,updateComment,deleteComment}