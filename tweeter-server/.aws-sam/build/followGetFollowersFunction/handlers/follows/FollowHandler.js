"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followHandler = void 0;
const FollowService_1 = require("../../services/FollowService");
const followHandler = async (request) => {
    const [followerCount, followeeCount] = new FollowService_1.FollowService().follow(request.userAlias);
    return {
        success: true,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
exports.followHandler = followHandler;
