import { AuthToken } from "tweeter-shared";

export interface AuthDAO {
  createAuthToken(alias: string): Promise<AuthToken>;
  deleteAuthToken(token: string): Promise<void>;
  getAliasForToken(token: string): Promise<string | null>;
}
