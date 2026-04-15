"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowersHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../../services/FollowService");
const getFollowersHandler = async (request) => {
    const lastItem = request.lastItem
        ? tweeter_shared_1.User.fromJson(JSON.stringify(request.lastItem))
        : null;
    const [items, hasMore] = new FollowService_1.FollowService().getFollowers(request.userAlias, request.pageSize, lastItem);
    return {
        success: true,
        items: items,
        hasMore: hasMore,
    };
};
exports.getFollowersHandler = getFollowersHandler;
