import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"

import { apiResponse } from "../utils/ApiResponse.js"
import { asyncHandeler } from "../utils/asyncHandeler.js"


const getChannelStats = asyncHandeler(async (req, res) => {
    const userId = req.user._id;

    const [totalVideos, viewsResult, totalSubscribers, userVideos] =
        await Promise.all([
            Video.countDocuments({ owner: userId }),

            Video.aggregate([
                { $match: { owner: userId } },
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: "$views" }
                    }
                }
            ]),

            Subscription.countDocuments({ channel: userId }),

            Video.find({ owner: userId }).select("_id")
        ]);

    const videoIds = userVideos.map(video => video._id);

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    const totalViews = viewsResult[0]?.totalViews ?? 0;

    return res.status(200).json(
        new apiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes
            },
            "Channel statistics fetched successfully"
        )
    );
});


const getChannelVideos = asyncHandeler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    const userId = req.user._id

    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10))
    const skip = (pageNumber - 1) * limitNumber;

    const videos = await Video.find({
        owner: userId
    }).populate("owner", "fullname username email")
        .skip(skip)
        .limit(limitNumber)

    const totalVideos = await Video.countDocuments({ owner: userId })

    return res.status(200).json(
        new apiResponse(
            200,
            {
                videos,
                pagination: {
                    currentPage: pageNumber,
                    limit: limitNumber,
                    totalVideos,
                    totalPages: Math.ceil(totalVideos / limitNumber)
                }
            },
            "Channel videos fetched successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}