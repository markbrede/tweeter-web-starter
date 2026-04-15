"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogoutHandler = void 0;
const UserService_1 = require("../../services/UserService");
const userLogoutHandler = async (request) => {
    new UserService_1.UserService().logout(request.authToken);
    return {
        success: true,
    };
};
exports.userLogoutHandler = userLogoutHandler;
