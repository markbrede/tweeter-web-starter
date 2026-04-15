"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowerCountHandler = void 0;
const FollowService_1 = require("../../services/FollowService");
const getFollowerCountHandler = async (request) => {
    const count = new FollowService_1.FollowService().getFollowerCount(request.userAlias);
    return {
        success: true,
        count: count,
    };
};
exports.getFollowerCountHandler = getFollowerCountHandler;
