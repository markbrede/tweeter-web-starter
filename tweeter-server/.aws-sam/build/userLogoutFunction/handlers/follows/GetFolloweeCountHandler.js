"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolloweeCountHandler = void 0;
const FollowService_1 = require("../../services/FollowService");
const getFolloweeCountHandler = async (request) => {
    const count = new FollowService_1.FollowService().getFolloweeCount(request.userAlias);
    return {
        success: true,
        count: count,
    };
};
exports.getFolloweeCountHandler = getFolloweeCountHandler;
