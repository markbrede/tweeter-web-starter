import { FakeData, User } from "tweeter-shared";
import { FollowDAO } from "../interfaces/FollowDAO";

export class FakeFollowDAO implements FollowDAO {
  public async getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(userAlias: string): Promise<number> {
    return FakeData.instance.getFolloweeCount(userAlias) as number;
  }

  public async getFollowerCount(userAlias: string): Promise<number> {
    return FakeData.instance.getFollowerCount(userAlias) as number;
  }

  public async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async follow(follower: User, followee: User): Promise<[number, number]> {
    return [
      FakeData.instance.getFollowerCount(followee.alias) as number,
      FakeData.instance.getFolloweeCount(follower.alias) as number,
    ];
  }

  public async unfollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<[number, number]> {
    return [
      FakeData.instance.getFollowerCount(followeeAlias) as number,
      FakeData.instance.getFolloweeCount(followerAlias) as number,
    ];
  }
}
