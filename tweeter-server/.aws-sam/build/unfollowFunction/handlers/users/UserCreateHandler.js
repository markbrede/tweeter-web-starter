"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCreateHandler = void 0;
const UserService_1 = require("../../services/UserService");
const userCreateHandler = async (request) => {
    const [user, authToken] = new UserService_1.UserService().createUser(request.firstName, request.lastName, request.alias, request.password, request.imageStringBase64, request.imageFileExtension);
    return {
        success: true,
        user: user,
        authToken: authToken,
    };
};
exports.userCreateHandler = userCreateHandler;
