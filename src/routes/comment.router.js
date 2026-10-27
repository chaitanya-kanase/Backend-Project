import { Router } from "express";
import { deleteComment,addComment, getVideoComments, updateComment } from "../controllers/comment.controller";
import { verifyJwt} from "../middlewares/auth.middleware"

const router = Router()

router.route("/add/:videoId").post(verifyJwt,addComment)
router.route("/update/:commentId").patch(verifyJwt,updateComment)
router.route("/delete/:commentId").delete(verifyJwt,deleteComment)
router.route("/get-all/:videoId").get(verifyJwt,getVideoComments)

export default router