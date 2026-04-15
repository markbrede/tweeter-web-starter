"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginHandler = void 0;
const UserService_1 = require("../../services/UserService");
const userLoginHandler = async (request) => {
    const [user, authToken] = new UserService_1.UserService().login(request.alias, request.password);
    return {
        success: true,
        user: user,
        authToken: authToken,
    };
};
exports.userLoginHandler = userLoginHandler;
