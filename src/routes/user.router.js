import { Router } from "express";
import {loginUser, registerUser,logoutUser, refershAccessToken, changePassword, getCurrentUser, updateAccountDetails, updateUserAvtar, updateCoverImg, getUserChannelProfile, getWatchHistory} from '../controllers/user.controller.js'
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/register").post(
     upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),

    registerUser)

    router.route("/login").post(loginUser)

    router.route("/logout").post(verifyJwt,logoutUser)

    router.route("/refresh-token").post(refershAccessToken)

    router.route("/change-password").post(verifyJwt,changePassword)

    router.route("/current-user").get(verifyJwt,getCurrentUser)

    router.route("/update-acc").patch(verifyJwt,updateAccountDetails)

    router.route("/update-avtar").patch(verifyJwt,upload.single("avtarUrl"),updateUserAvtar)

    router.route("/update-cover-image").patch(verifyJwt,upload.single("coverImgUrl"),updateCoverImg)

    router.route("/channel/:username").get(verifyJwt,getUserChannelProfile)

    router.route("/watch-history").get(verifyJwt,getWatchHistory)

export default router;