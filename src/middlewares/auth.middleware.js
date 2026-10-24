import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandeler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

//         console.log("Cookies:", req.cookies);
// console.log("Authorization:", req.header("Authorization"));
// console.log("Extracted token:", token);
// console.log("Token type:", typeof token);



    
        if(!token){
            throw new apiError(400,"Access Token missing")
        }
    
        const decodedeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECREATE)
    
        const user =await User.findById(decodedeToken._id).select("-password -refreshtoken")
    
        if(!user){
            throw new apiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new apiError(400, error.message || "Invalide access token")
    }
})