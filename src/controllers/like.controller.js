import mongoose from "mongoose";
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Comment} from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse} from "../utils/apiResponse.js"
import {asyncHandeler} from "../utils/asyncHandeler.js"

const toggleVideoLike = asyncHandeler(async(req,res)=>{
    const { videoId } = req.params;

    if(!mongoose.isValidObjectId(videoId)){
        throw new apiError(400,"Invalid video ID")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new apiError(404,"Video not found")
    }

    const exsistingLike = await Like.findOne({
        video : videoId,
        likedBy : req.user._id
    })

    if(exsistingLike){
        await Like.findByIdAndDelete(exsistingLike._id)

        return res.status(200).json(
            new apiResponse(200,null, "Unliked Successfully")
        )
    }

    const like = await Like.create({
        video : videoId,
        likedBy : req.user._id
    })

    return res.status(200).json(
        new apiResponse(200,like, "Video liked Successfully")
    )
})

const toggleCommentLike = asyncHandeler(async(req,res)=>{
    const { commentId } = req.params;

    if(!mongoose.isValidObjectId(commentId)){
        throw new apiError(400,"Invalid comment ID")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new apiError(404,"Comment not found")
    }

    const exsistingLike = await Like.findOne({
        comment : commentId,
        likedBy : req.user._id
    })

    if(exsistingLike){
        await Like.findByIdAndDelete(exsistingLike._id)

        return res.status(200).json(
            new apiResponse(200,null, "Unliked Successfully")
        )
    }

    const like = await Like.create({
        comment : commentId,
        likedBy : req.user._id
    })

    return res.status(200).json(
        new apiResponse(200,like, "comment liked Successfully")
    )
})

const toggleTweetLike = asyncHandeler(async(req,res)=>{
    const { tweetId } = req.params;

    if(!mongoose.isValidObjectId(tweetId)){
        throw new apiError(400,"Invalid tweet ID")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new apiError(404,"Tweet not found")
    }

    const exsistingTweet = await Like.findOne({
        tweet : tweetId,
        likedBy : req.user._id
    })

    if(exsistingTweet){
        await Like.findByIdAndDelete(exsistingTweet._id)

        return res.status(200).json(
            new apiResponse(200,null, "Unliked Successfully")
        )
    }

    const like = await Like.create({
        tweet : tweetId,
        likedBy : req.user._id
    })

    return res.status(200).json(
        new apiResponse(200,like, "Tweet liked Successfully")
    )
})

const getLikedVideos = asyncHandeler(async(req,res)=>{
    const {userId} = req.params

    if(!mongoose.isValidObjectId(userId)){
        throw new apiError(400, "Invalid user ID")
    }

    const likedVideos = await Like.find({
        likedBy : userId,
        video: { $exists: true, $ne: null }
    }).populate("video")

    return res.status(200).json(
        new apiResponse(200,likedVideos,"Fetched all liked Videos")
    )
})

export {toggleVideoLike,toggleCommentLike,toggleTweetLike,getLikedVideos}
