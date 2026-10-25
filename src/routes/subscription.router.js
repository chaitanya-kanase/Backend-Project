import { Router } from "express";
import { getChannelSubscribers,getSubscribedChannels,toggeleSubscription } from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/subscribed-channels/:userId").get(verifyJwt,getSubscribedChannels)
router.route("/channel-subscribers/:cahnnelId").get(verifyJwt,getChannelSubscribers)
router.route("/toggel-subscription/:channelId").post(verifyJwt,toggeleSubscription)

export default router;