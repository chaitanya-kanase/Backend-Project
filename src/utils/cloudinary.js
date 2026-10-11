import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async(localpath)=>{
    try {
        if(localpath){
            const response = cloudinary.uploader.upload(localpath,{resource_type : "auto"})
            fs.unlink(localpath)

            return response;
            
        }else{
            return null
        }
    } catch (error) {
        fs.unlink(localpath)
        return null;
    }
}

export {uploadOnCloudinary}