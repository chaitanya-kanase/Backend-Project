const asyncHandeler = (requestHandeler)=> {return(req,res,next)=>{
    Promise.resolve(requestHandeler(req,res,next))
    .catch((error)=> next(error))
}}

export {asyncHandeler}

//Second Methode without promises
//Use of async await and try catch

// const asynHandeler = (fn)=> async(req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             message :error.message,
//             success : false
//         })
        
//     }
// }