import { FakeData, User } from "tweeter-shared";

export class FollowService {
  public getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): boolean {
    return FakeData.instance.isFollower();
  }

  public getFolloweeCount(userAlias: string): number {
    return FakeData.instance.getFolloweeCount(userAlias) as number;
  }

  public getFollowerCount(userAlias: string): number {
    return FakeData.instance.getFollowerCount(userAlias) as number;
  }

  public getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): [User[], boolean] {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): [User[], boolean] {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public follow(userAlias: string): [number, number] {
    return [
      FakeData.instance.getFollowerCount(userAlias) as number,
      FakeData.instance.getFolloweeCount(userAlias) as number,
    ];
  }

  public unfollow(userAlias: string): [number, number] {
    return [
      FakeData.instance.getFollowerCount(userAlias) as number,
      FakeData.instance.getFolloweeCount(userAlias) as number,
    ];
  }
}
