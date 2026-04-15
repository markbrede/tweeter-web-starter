"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    getIsFollowerStatus(userAlias, selectedUserAlias) {
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    getFolloweeCount(userAlias) {
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(userAlias);
    }
    getFollowerCount(userAlias) {
        return tweeter_shared_1.FakeData.instance.getFollowerCount(userAlias);
    }
    getFollowees(userAlias, pageSize, lastItem) {
        return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    }
    getFollowers(userAlias, pageSize, lastItem) {
        return tweeter_shared_1.FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    }
    follow(userAlias) {
        return [
            tweeter_shared_1.FakeData.instance.getFollowerCount(userAlias),
            tweeter_shared_1.FakeData.instance.getFolloweeCount(userAlias),
        ];
    }
    unfollow(userAlias) {
        return [
            tweeter_shared_1.FakeData.instance.getFollowerCount(userAlias),
            tweeter_shared_1.FakeData.instance.getFolloweeCount(userAlias),
        ];
    }
}
exports.FollowService = FollowService;
