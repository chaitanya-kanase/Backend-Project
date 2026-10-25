import mongoose from "mongoose";
import { asyncHandeler } from "../utils/asyncHandeler.js"
import {apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiResponse } from "../utils/apiResponse.js"



const toggeleSubscription = asyncHandeler(async(req,res)=>{
    const {channelId} = req.params
    const { subscriberId } = req.user._id


    if(!mongoose.isValidObjectId(channelId)){
        throw new apiError(400, "Invalid channel ID")
    }

    if(subscriberId.toString() == channelId){
        throw new apiError(400, "You can not subscribe your own channel")
    }

    const channelExist = await User.exists({_id : channelId})

    if(!channelExist){
        throw new apiError(400, "channel does not exist")
    }


    const existingSubscription = await Subscription.findOne({
        channel : channelId,
        subscriber : subscriberId
    })

    if(existingSubscription){
        await Subscription.deleteOne({
            _id : existingSubscription._id
        })

        return res.status(200).json(
            new apiResponse(200, { subscribed : false}, "unsubscribed successfully")
        )
    }

    await Subscription.create({
        channel : channelId,
        subscriber : subscriberId
    })

    return res.status(200).json(
        new apiResponse(200,{ subscribed : true}, "Subscribed successfully")
    )

})

const getChannelSubscribers = asyncHandeler(async(req,res)=>{
    const channelId = req.params

    if(!channelId){
        throw new apiError(400,"Invalid channel ID")
    }

    const subscribers = await Subscription.find({
        channel : channelId
    }).populate("subscriber", "username fullname avtar")

    return res.status(200).json(
        new apiResponse(200, subscribers, "Subscribers fetched successfully")
    )
})

const getSubscribedChannels = asyncHandeler(async(req,res)=>{
    const { userId } = req.params 

    if(!mongoose.isValidObjectId(userId)){
        throw new apiError(400, "Invalid user ID")
    }

    const channels = await Subscription.find({
        subscriber : userId
    }).populate("channel","username fullname avtar")


    return res.status(200).json(
        new apiResponse(200, channels, "Subscribed channels fetched successfully")
    )
})

export {toggeleSubscription,getChannelSubscribers,getSubscribedChannels}