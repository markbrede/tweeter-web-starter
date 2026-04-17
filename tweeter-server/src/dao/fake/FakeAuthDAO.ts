import { AuthToken, FakeData } from "tweeter-shared";
import { AuthDAO } from "../interfaces/AuthDAO";

export class FakeAuthDAO implements AuthDAO {
  public async createAuthToken(alias: string): Promise<AuthToken> {
    return FakeData.instance.authToken;
  }

  public async deleteAuthToken(token: string): Promise<void> {
    return;
  }

  public async getAliasForToken(token: string): Promise<string | null> {
    return FakeData.instance.firstUser?.alias ?? null;
  }
}
