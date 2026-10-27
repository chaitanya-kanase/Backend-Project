import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create").post(verifyJwt,createTweet)
router.route("/update/:id").patch(verifyJwt,updateTweet)
router.route("/delete/:id").delete(verifyJwt,deleteTweet)
router.route("/get-all").get(verifyJwt,getUserTweets)

export default router;