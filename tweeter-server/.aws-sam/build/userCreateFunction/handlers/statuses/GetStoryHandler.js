"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoryHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../../services/StatusService");
const getStoryHandler = async (request) => {
    const lastItem = request.lastItem
        ? tweeter_shared_1.Status.fromJson(JSON.stringify(request.lastItem))
        : null;
    const [items, hasMore] = new StatusService_1.StatusService().getStory(request.userAlias, request.pageSize, lastItem);
    return {
        success: true,
        items: items,
        hasMore: hasMore,
    };
};
exports.getStoryHandler = getStoryHandler;
