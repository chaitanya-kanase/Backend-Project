import { Router } from "express";
import { getLikedVideos,toggleCommentLike,toggleTweetLike,toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/comment/:commentId").post(verifyJwt,toggleCommentLike)
router.route("/tweet/:tweetId").post(verifyJwt,toggleTweetLike)
router.route("/video/:videoId").post(verifyJwt,toggleVideoLike)
router.route("/get-liked-videos/:userId").get(verifyJwt,getLikedVideos)

export default router