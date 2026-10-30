import { Router } from "express";
import { getChannelStats,getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/get-states").get(verifyJwt,getChannelStats)
router.route("/get-videos").get(verifyJwt,getChannelVideos)

export default router