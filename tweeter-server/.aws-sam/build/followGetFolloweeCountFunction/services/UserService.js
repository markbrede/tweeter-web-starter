"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    getUser(alias) {
        return tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
    }
    createUser(firstName, lastName, alias, password, imageStringBase64, imageFileExtension) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("internal-server-error: unable to create user");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken];
    }
    login(alias, password) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("bad-request: invalid alias or password");
        }
        return [user, tweeter_shared_1.FakeData.instance.authToken];
    }
    logout(authToken) {
        return;
    }
}
exports.UserService = UserService;
