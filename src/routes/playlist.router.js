import { Router } from "express";
import { addVideoToPlaylist,getPlaylistById,createPlaylist,deletePlaylist,updatePlaylist,removeVideoFromPlaylist,getUserPlaylists } from "../controllers/playlist.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create").post(verifyJwt,createPlaylist)
router.route("/update/:playlistId").patch(verifyJwt,updatePlaylist)
router.route("/delete/:playlistId").delete(verifyJwt,deletePlaylist)
router.route("/add-video/:playlistId/:videoId").post(verifyJwt,addVideoToPlaylist)
router.route("/remove-video/:playlistId/:videoId").post(verifyJwt,removeVideoFromPlaylist)
router.route("/get-by-id/:playlistId").get(verifyJwt,getPlaylistById)
router.route("/get-user-playlist/:userId").get(verifyJwt,getUserPlaylists)

export default router
