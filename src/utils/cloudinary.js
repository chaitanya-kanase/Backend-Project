import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: 'ac5wkrgw',
    api_key: '347198447444779',
    api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
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