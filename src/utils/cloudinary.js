import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises"

cloudinary.config({
    cloud_name: "ac5wkrgw",
    api_key:347198447444779,
    api_secret:"yLH-E7bBnUCdXiRQzD_nn5kQYz0" // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async(localpath)=>{
    try {
        if(localpath){
            const response = cloudinary.uploader.upload(localpath,{resource_type : "auto"})
            fs.unlinkSync(localpath)

            return response;
            
        }else{
            return null
        }
    } catch (error) {
        await fs.unlink(localpath)
        console.log("cloudinary error :", error)
    }
}

export {uploadOnCloudinary}