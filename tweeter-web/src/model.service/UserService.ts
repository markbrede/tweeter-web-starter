import { Buffer } from "buffer";
import {
  AuthToken,
  GetUserRequest,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../model.net/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.serverFacade.getUser(new GetUserRequest(authToken.token, alias));
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login(new LoginRequest(alias, password));
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.register(
      new RegisterRequest(
        firstName,
        lastName,
        alias,
        password,
        imageStringBase64,
        imageFileExtension,
      ),
    );
  }

  public async logout(authToken: AuthToken): Promise<void> {
    return this.serverFacade.logout(new LogoutRequest(authToken.token));
  }
}
