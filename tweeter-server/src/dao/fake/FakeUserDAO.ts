import { FakeData, User } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";

export class FakeUserDAO implements UserDAO {
  public async getUser(alias: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  }

  public async registerUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<User> {
    const user = FakeData.instance.firstUser;

    if (!user) {
      throw new Error("internal-server-error: unable to register user");
    }

    return user;
  }

  public async authenticateUser(alias: string, password: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias) ?? FakeData.instance.firstUser;
  }
}
