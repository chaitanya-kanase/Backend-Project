import {asyncHandeler} from '../utils/asyncHandeler.js'
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"

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

export {registerUser}