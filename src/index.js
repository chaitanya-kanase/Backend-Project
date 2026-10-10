import dotenv from "dotenv"
import connectDb from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path:"./.env"
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server Listing on port ${process.env.PORT}`)
    })
})
.catch((e)=>{
    console.error("MongoDb connection Error :",e)
})