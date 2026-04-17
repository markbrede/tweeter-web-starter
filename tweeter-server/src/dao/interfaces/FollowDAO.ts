import { User } from "tweeter-shared";

export interface FollowDAO {
  getIsFollowerStatus(userAlias: string, selectedUserAlias: string): Promise<boolean>;
  getFolloweeCount(userAlias: string): Promise<number>;
  getFollowerCount(userAlias: string): Promise<number>;
  getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]>;
  getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]>;
  follow(follower: User, followee: User): Promise<[number, number]>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<[number, number]>;
}
