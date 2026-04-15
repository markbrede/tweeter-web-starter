"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFollowerStatusHandler = void 0;
const FollowService_1 = require("../../services/FollowService");
const isFollowerStatusHandler = async (request) => {
    const isFollower = new FollowService_1.FollowService().getIsFollowerStatus(request.userAlias, request.selectedUserAlias);
    return {
        success: true,
        isFollower: isFollower,
    };
};
exports.isFollowerStatusHandler = isFollowerStatusHandler;
