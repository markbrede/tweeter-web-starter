"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postStatusHandler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../../services/StatusService");
const postStatusHandler = async (request) => {
    const status = tweeter_shared_1.Status.fromJson(JSON.stringify(request.newStatus));
    if (!status) {
        throw new Error("bad-request: invalid status");
    }
    new StatusService_1.StatusService().postStatus(status);
    return {
        success: true,
    };
};
exports.postStatusHandler = postStatusHandler;
