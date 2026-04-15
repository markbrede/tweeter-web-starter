"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../../services/StatusService");
const getFeedHandler = async (request) => {
    const lastItem = request.lastItem
        ? tweeter_shared_1.Status.fromJson(JSON.stringify(request.lastItem))
        : null;
    const [items, hasMore] = new StatusService_1.StatusService().getFeed(request.userAlias, request.pageSize, lastItem);
    return {
        success: true,
        items: items,
        hasMore: hasMore,
    };
};
exports.getFeedHandler = getFeedHandler;
