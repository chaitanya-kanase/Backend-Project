import {asyncHandeler} from '../utils/asyncHandeler.js'
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import { Subscription } from '../models/subscription.model.js'
import mongoose from 'mongoose'

const generateAccessAndRefreshToken = async(userId)=>{
    const user =await User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshtoken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken,refreshToken}
}

const registerUser = asyncHandeler(async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, fullname, password, email } = req.body;

    if(
        [username, fullname, password, email].some((field)=>field?.trim() === "")
    ){
        throw new apiError(400,"All Fields are required")
    }

    const existedUser =await  User.findOne({
        $or : [{ username }, { email }]
    });

    if(existedUser){
        throw new apiError(409,"This username or email already exists ")
    }

    const localAvatar = req.files?.avatar?.[0]?.path;
    const localCoverImage = req.files?.coverImage?.[0].path;

    if(!localAvatar){
        throw new apiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(localAvatar)
    const coverImage = await uploadOnCloudinary(localCoverImage)

    if(!avatar){
        throw new apiError(500,"Something went wrong")
    }


    const user = await User.create({
        username,
        email,
        fullname,
        avtar : avatar?.url,
        coverimage : coverImage?.url || "",
        password,
    })

    const response = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if(!response){
        throw new apiError(500,"Something wemt wrong while registering")
    }

    return res.status(200).json( new apiResponse(201,response,"User registered successfully"))
})

const loginUser = asyncHandeler(async(req,res)=>{
    const { username,email,password } = req.body;

    if(!(email || username)){
        throw new apiError(400,"All credentials are required")
    }

    const user = await User.findOne({
        $or : [{ email },{ username }]
    })

    if(!user){
        throw new apiError(401,"User doesn't exist")
    }

    const isUserValide =await user.isPasswordCorrect( password )

    if(!isUserValide){
        throw new apiError(401, "Password is incorrect, plz entre correct passsword")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


    const loggedUser = await User.findById(user._id).select("-password -refreshtoken");

    const options = {
        httpOnly : true,
        secure : false
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new apiResponse(
        200,
        {
        user: loggedUser,
        accessToken,
        refreshToken
    },

    "User Logged In"
    ))
    
})

const logoutUser = asyncHandeler(async (req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new apiResponse(201, {}, "User logged out successfully"))
})

const refershAccessToken = asyncHandeler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshtoken

    if(!incomingRefreshToken){
        throw new apiError(400 , "Unauthorized access")
    }

    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECREATE)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new apiError(404,"User not exists")
    }

    if(incomingRefreshToken !== user.refreshtoken){
        throw new apiError(400,"Token expired")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
    const options = 
        {
            secure : true,
            httpOnly : true
        }
    

    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        apiResponse(
            201,
            {accessToken,refreshToken},
            "Token created successfully"
        )
    )
})

const changePassword = asyncHandeler(async(req,res)=>{
    const { oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new apiError(400,"All credentials are required")
    }
    const user = User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new apiError(400,"Password is incorrect")
    }

    user.password = newPassword

    user.save({validateBeforeSave : false})

    return res.status(200).json(new apiResponse(201,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandeler(async(req,res)=>{
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandeler(async(req,res)=>{
    const {email, fullname} = req.body

    if(!email || !fullname){
        throw new apiError(400,"Email or Fullname required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                fullname,
                email
            }
        },
        {
            new : true
        }
    ).select("-password")

    return res.status(200).json(new apiResponse(200,user,"Account details chabged successfully"))
})

const updateUserAvtar = asyncHandeler(async(req,res)=>{
    const avtarUrl = req.file?.url

    if(!avtarUrl){
        throw new apiError(400,"error while uploading an avtar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avtar: avtarUrl
            }
        },
        {new:true}
    )

    return res.status(200).json(new apiResponse(200,user,"Avtar updated successfully"))
})

const updateCoverImg = asyncHandeler(async(req,res)=>{
    const coverImgUrl = req.file?.url

    if(!avtarUrl){
        throw new apiError(400,"error while uploading an cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverimage: coverImgUrl
            }
        },
        {new:true}
    )

    return res.status(200).json(new apiResponse(200,user,"coverimage updated successfully"))

})

const getUserChannelProfile = asyncHandeler(async(req,res)=>{
    const {username} = req.params

    if(!username?.trim()){
        throw new apiError(400,"username is required")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username : username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from : "subscriptions",
                localField : "_id",
                foreingField : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup:{
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount : {
                    $size : "$subscribers"
                },

                channelsSubscribedTo : {
                    $size : "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                subscriberCount: 1,
                channelsSubscribedTo: 1,
                isSubscribed: 1,
                email : 1,
                coverImage :1
            }
        }
    ])

     if (!channel?.length) {
        throw new apiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, channel[0], "User channel fetched successfully")
    )
})

const getWatchHistory = asyncHandeler(async(req,res)=>{
    const history = User.aggregate([
        {
            $match:{
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",

                pipeline:[
                    {
                        $lookup:{
                            from : "users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",

                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avtar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new apiResponse(201,history[0].watchHistory),"watch history fetched successfully")
})

export {registerUser,loginUser,logoutUser,refershAccessToken,changePassword,getCurrentUser,updateAccountDetails,updateUserAvtar,updateCoverImg,getUserChannelProfile,getWatchHistory}