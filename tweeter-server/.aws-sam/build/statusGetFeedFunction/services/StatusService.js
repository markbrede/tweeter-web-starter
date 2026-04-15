"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class StatusService {
    getFeed(userAlias, pageSize, lastItem) {
        return tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }
    getStory(userAlias, pageSize, lastItem) {
        return tweeter_shared_1.FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }
    postStatus(newStatus) {
        return;
    }
}
exports.StatusService = StatusService;
