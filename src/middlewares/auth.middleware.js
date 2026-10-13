import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandeler } from "../utils/asyncHandeler";
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandeler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken 
    
        if(!token){
            throw new apiError(400,"Unauthorized access")
        }
    
        const decodedeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECREATE)
    
        const user = User.findById(decodedeToken._id).select("-password -refreshtoken")
    
        if(!user){
            throw new apiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new apiError(400, error.message || "Invalide access token")
    }
})