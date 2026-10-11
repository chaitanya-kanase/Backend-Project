class apiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        stack
    ){
        super(message)
        this.statusCode = statusCode
        this.Error = errors
        this.success = false
        this.data = null
        this.message = message

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {apiError}