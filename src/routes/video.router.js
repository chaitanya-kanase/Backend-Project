import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/all-videos").get(getAllVideos)
router.route("/publish-video").post(verifyJwt ,upload.single("videoFile"),publishAVideo)
router.route("/get/:id").get(verifyJwt,getVideoById)
router.route("/toggle-publish/:videoId").post(verifyJwt,togglePublishStatus)
router.route("/update/:videoId").post(verifyJwt,updateVideo)
router.route("/delete/:videoId").post(verifyJwt,deleteVideo)

export default router