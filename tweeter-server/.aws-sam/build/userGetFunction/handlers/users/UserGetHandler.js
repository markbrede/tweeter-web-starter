"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGetHandler = void 0;
const UserService_1 = require("../../services/UserService");
const userGetHandler = async (request) => {
    const user = new UserService_1.UserService().getUser(request.alias);
    if (user === null) {
        throw new Error("bad-request: user not found");
    }
    return {
        success: true,
        user: user,
    };
};
exports.userGetHandler = userGetHandler;
