import { User } from "tweeter-shared";

export interface UserDAO {
  getUser(alias: string): Promise<User | null>;
  registerUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<User>;
  authenticateUser(alias: string, password: string): Promise<User | null>;
}
