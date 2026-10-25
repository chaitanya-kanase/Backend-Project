import mongoose from "mongoose";
import { Video } from '../models/video.model.js'

import { asyncHandeler } from "../utils/asyncHandeler.js"
import { apiResponse } from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllVideos = asyncHandeler(async (req, res) => {
    //get all parameters required from params 
    //find the pageNumber and limitNumber 
    //then create a filter object to find the videos as per search all first add only published videos
    //check for query and title in the filter using regex
    //check for userId if valid add owner in the filter
    //now check for sortby and declare the sort options in the array
    //check for sortType if not then asc 
    // check for the video in the databse then use populate for username and fullname
    //use sort for sorting the videos as per the fields
    //use skip to change the pages and adding the videos in the pages
    //use limit for page videos
    //find total videos 
    //send response

    const { page = 1, limit = 10, query, sortBy, sortType = "asc", userId } = req.query

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));

    const filter = {
        isPublished: true
    }

    if (query?.trim()) {
        filter.title = {
            $regex: query.trim(),
            $options: "i"
        }
    }

    if (userId) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new apiError(400, "The user doesn't exist")
        }

        filter.owner = new mongoose.Types.ObjectId(userId)
    }

    const allowedSortFields = ["createdAt", "views", "owner"]
    const field = allowedSortFields.includes(sortBy)
        ? sortBy : "createdAt";

    const sortOrder = sortType === "asc" ? 1 : -1;

    const videos = await Video.find(filter)
        .populate("owner", "username fullname avtar")
        .sort({ [field]: sortOrder })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)

    const totalVideos = await Video.countDocuments(filter)

    return res.status(200).json(
        new apiResponse(
            200,
            {
                videos,
                pagination: {
                    totalVideos,
                    currentPage: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(totalVideos / limitNumber)
                }
            },
            " Videos fetched Successfully"
        )
    )

})

const getVideoById = asyncHandeler(async (req, res) => {

    const { id } = req.params

    if(!mongoose.isValidObjectId(id)){
        throw new apiError(400,"Invalid video ID")
    }
    const video = await Video.findOne({_id : id, isPublished:true})

    if (!video) {
        throw new apiError(404, "Video doesn't exist")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            video,
            "Videos fetched successfully"
        )
    )
})

const publishAVideo = asyncHandeler(async (req, res) => {

    const { title, description, thumbnail } = req.body


    if (!title?.trim() || !description?.trim() || !thumbnail?.trim()) {
        throw new apiError(400, "Title and description required")
    }

    const videoUrl = req.file?.path


    if (!videoUrl) {
        throw new apiError(400, "Video file required")
    }

    const uploadedVideo = await uploadOnCloudinary(videoUrl)


    if (!uploadedVideo) {
        throw new apiError(400, "error while uploading the video on clodinary")
    }

    const video = await Video.create({
        videofile: uploadedVideo.secure_url,
        thumbnail,
        title,
        description,
        duration: uploadedVideo.duration,
        owner: req.user._id
    })

    return res.status(200).json(
        new apiResponse(
            200,
            video,
            "Video uploaded successfully"
        )
    )


})

const togglePublishStatus = asyncHandeler(async (req, res) => {
    const { videoId } = req.params;

    if(!mongoose.isValidObjectId(videoId)){
        throw new apiError(400,"Invalid video ID")
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    });

    if (!video) {
        throw new apiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new apiResponse(
            200,
            video,
            "Video publish status updated successfully"
        )
    );
});

const updateVideo = asyncHandeler(async (req, res) => {
    const { title, description, thumbnail } = req.body

    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findOne({
        owner: req.user._id,
        _id: videoId
    })

    if (!video) {
        throw new apiError(404, "Video does not exist")
    }

    video.title = title
    video.description = description
    video.thumbnail = thumbnail

    await video.save()



    return res.status(200).json(
        new apiResponse(
            200,
            video,
            "Video Updated successfully"
        )
    )
})

const deleteVideo = asyncHandeler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new apiError(400, "Invalid video ID");
    }

    const video = await Video.findOneAndDelete({
        _id: videoId,
        owner: req.user._id
    })

    if (!video) {
        throw new apiError(404, "Video does not exist")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            video,
            "Video deleted successfully"
        )
    )

})

export { getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo, deleteVideo };