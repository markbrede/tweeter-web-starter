"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfollowHandler = void 0;
const FollowService_1 = require("../../services/FollowService");
const unfollowHandler = async (request) => {
    const [followerCount, followeeCount] = new FollowService_1.FollowService().unfollow(request.userAlias);
    return {
        success: true,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
exports.unfollowHandler = unfollowHandler;
