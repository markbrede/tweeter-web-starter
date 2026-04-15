import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  public getUser(alias: string): User | null {
    return FakeData.instance.findUserByAlias(alias);
  }

  public createUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): [User, AuthToken] {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("internal-server-error: unable to create user");
    }

    return [user, FakeData.instance.authToken];
  }

  public login(alias: string, password: string): [User, AuthToken] {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("bad-request: invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public logout(authToken: string): void {
    return;
  }
}
