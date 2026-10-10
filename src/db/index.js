import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDb = async ( )=>{
    try {
        const connection_instance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDb connected. DB Host : ${connection_instance.connection.host}`)
        
    } catch (error) {
        console.error("Mongodb connection error :", error)
        process.exit(1)
    }
}

export default connectDb;