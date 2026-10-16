import {asyncHandeler} from '../utils/asyncHandeler.js'
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

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



export {registerUser,loginUser,logoutUser,refershAccessToken}