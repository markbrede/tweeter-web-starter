import {
  AuthToken,
  FollowActionRequest,
  IsFollowerStatusRequest,
  PagedUserItemRequest,
  User,
  UserCountRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../model.net/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowees(
      new PagedUserItemRequest(authToken.token, userAlias, pageSize, lastItem)
    );
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    return this.serverFacade.getMoreFollowers(
      new PagedUserItemRequest(authToken.token, userAlias, pageSize, lastItem)
    );
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    return this.serverFacade.getIsFollowerStatus(
      new IsFollowerStatusRequest(authToken.token, user.alias, selectedUser.alias)
    );
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount(
      new UserCountRequest(authToken.token, user.alias)
    );
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return this.serverFacade.getFollowerCount(
      new UserCountRequest(authToken.token, user.alias)
    );
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.follow(
      new FollowActionRequest(authToken.token, userToFollow.alias)
    );
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.unfollow(
      new FollowActionRequest(authToken.token, userToUnfollow.alias)
    );
  }
}
