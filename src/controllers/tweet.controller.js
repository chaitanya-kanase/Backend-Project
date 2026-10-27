import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";


const createTweet = asyncHandeler(async (req, res) => {
    const { content } = req.body

    if (typeof content !== "string" || !content.trim()) {
        throw new apiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res.status(201).json(
        new apiResponse(201, tweet, "Tweet created successfully")
    )
})

const updateTweet = asyncHandeler(async (req, res) => {
    const { id } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(id)) {
        throw new apiError(400, "Invalid tweet ID")
    }

    if (typeof content !== "string" || !content.trim()) {
        throw new apiError(400, "Content is required");
    }

    const tweet = await Tweet.findOne({
        _id: id,
        owner: req.user._id
    })

    if (!tweet) {
        throw new apiError(404, "Tweet doesn't Exsit")
    }

    tweet.content = content
    await tweet.save()

    return res.status(200).json(
        new apiResponse(200, tweet, "Tweet Updated Successfully")
    )
})

const deleteTweet = asyncHandeler(async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        throw new apiError(400, "Invalid tweet Id")
    }

    const tweet = await Tweet.findOneAndDelete({
        _id: id,
        owner: req.user._id
    })

    if (!tweet) {
        throw new apiError(404, "Tweet does not exist")
    }

    return res.status(200).json(
        new apiResponse(200, tweet, "Tweet deleted successfully")
    )
})

const getUserTweets = asyncHandeler(async (req, res) => {
    const id = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
        throw new apiError(400, "User not found")
    }

    const tweets = await Tweet.find({
        owner: id
    })

    return res.status(200).json(
        new apiResponse(200,tweets,"Tweets fetched successfully")
    )
})


export { createTweet, updateTweet, deleteTweet, getUserTweets }

