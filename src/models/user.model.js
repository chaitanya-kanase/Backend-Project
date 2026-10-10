import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },

    fullname: {
        type: String,
        required: true,
        trim: true
    },

    avtar: {
        type: String,
        required: true
    },

    coverimage: {
        type: String,

    },

    password: {
        type: String,
        required: true,

    },

    watchhsitory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    refreshtoken: {
        type: String
    }
}, { timeStamps: true })

userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methodes.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password)
}

userSchema.methodes.generateAccessToken = async () => {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECREATE,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methodes.generateRefreshToken = async () => {
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.REFRESH_TOKEN_SECREATE,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)