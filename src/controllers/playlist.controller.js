import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { apiError, ApiError } from "../utils/ApiError.js"
import { apiResponse, ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (typeof name !== "string" || !name.trim() || !description) {
        throw new apiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: []
    })

    return res.status(201).json(
        new apiResponse(201, playlist, "Playlist created successfully.")
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new apiError(400, "Invalid user ID")
    }

    const playlists = await Playlist.find({
        owner: userId
    }).populate("videos")

    return res.status(200).json(
        new apiResponse(200, playlists, "Playlist fetched successfully")
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos")

    if (!playlist) {
        throw new apiError(404, "Playlist not exist")
    }

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new apiError(400, "Invalide playlist or video ID")
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id
    })

    if (!playlist) {
        throw new apiError(404, "Playlist not exist")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not exist")
    }

    if (playlist.videos.some(id => id.equals(videoId))) {
        throw new apiError(400, "Video already exists in playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()


    return res.status(200).json(
        new apiResponse(200, playlist, "Video added successfully")
    )


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id
    })

    if (!playlist) {
        throw new apiError(404, "Playlist not exist")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new apiError(404, "Video not exist")
    }

    const videoIndex = playlist.videos.findIndex(
        id => id.equals(videoId)
    )

    if (videoIndex === -1) {
        throw new apiError(404, "Video not exist in playlist")
    }

    playlist.videos.splice(videoIndex, 1)
    await playlist.save()

    return res.status(200).json(
        new apiResponse(200, playlist, "Video removed from playlist successfully")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user._id
    })

    if (!playlist) {
        throw new apiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    if (!isValidObjectId(playlistId)) {
        throw new apiError(400, "Invalid playlist ID")
    }

    if (name === undefined && description === undefined) {
        throw new apiError(400, "Name or description is required");
    }

    if (name !== undefined &&
        (typeof name !== "string" || !name.trim())) {
        throw new apiError(400, "Playlist name cannot be empty");
    }

    if (description !== undefined &&
        typeof description !== "string") {
        throw new apiError(400, "Description must be a string");
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: req.user._id
    })

    if (!playlist) {
        throw new apiError(404, "Playlist not found")
    }

    if (name !== undefined) {
        playlist.name = name.trim();
    }

    if (description !== undefined) {
        playlist.description = description.trim();
    }

    await playlist.save()

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}