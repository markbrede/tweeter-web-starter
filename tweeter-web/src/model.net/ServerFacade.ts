import {
  AuthToken,
  FollowActionRequest,
  FollowActionResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerStatusRequest,
  IsFollowerStatusResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  RegisterResponse,
  Status,
  TweeterResponse,
  User,
  UserCountRequest,
  UserCountResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://m58r8ac3b5.execute-api.us-east-1.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    if (response.success) {
      return response.user
        ? User.fromJson(JSON.stringify(response.user))
        : null;
    } else {
      throw new Error(response.message ?? "Unable to get user");
    }
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/user/create");

    if (response.success && response.user && response.authToken) {
      const user = User.fromJson(JSON.stringify(response.user));
      const authToken = AuthToken.fromJson(JSON.stringify(response.authToken));

      if (user && authToken) {
        return [user, authToken];
      } else {
        throw new Error("Unable to parse register response");
      }
    } else {
      throw new Error(response.message ?? "Unable to register user");
    }
  }

  public async login(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/user/login");

    if (response.success && response.user && response.authToken) {
      const user = User.fromJson(JSON.stringify(response.user));
      const authToken = AuthToken.fromJson(JSON.stringify(response.authToken));

      if (user && authToken) {
        return [user, authToken];
      } else {
        throw new Error("Unable to parse login response");
      }
    } else {
      throw new Error(response.message ?? "Unable to log in");
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/logout");

    if (!response.success) {
      throw new Error(response.message ?? "Unable to log out");
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerStatusRequest,
      IsFollowerStatusResponse
    >(request, "/follow/is-follower");

    if (response.success) {
      return response.isFollower;
    } else {
      throw new Error(response.message ?? "Unable to get follower status");
    }
  }

  public async getFolloweeCount(
    request: UserCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserCountRequest,
      UserCountResponse
    >(request, "/follow/followee-count");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Unable to get followee count");
    }
  }

  public async getFollowerCount(
    request: UserCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserCountRequest,
      UserCountResponse
    >(request, "/follow/follower-count");

    if (response.success) {
      return response.count;
    } else {
      throw new Error(response.message ?? "Unable to get follower count");
    }
  }

  public async follow(
    request: FollowActionRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(response.message ?? "Unable to follow user");
    }
  }

  public async unfollow(
    request: FollowActionRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      throw new Error(response.message ?? "Unable to unfollow user");
    }
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/followees");

    const items =
      response.success && response.items
        ? response.items
            .map((item) => User.fromJson(JSON.stringify(item)))
            .filter((item): item is User => item !== null)
        : [];

    if (response.success) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Unable to get followees");
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/followers");

    const items =
      response.success && response.items
        ? response.items
            .map((item) => User.fromJson(JSON.stringify(item)))
            .filter((item): item is User => item !== null)
        : [];

    if (response.success) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Unable to get followers");
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/feed");

    const items =
      response.success && response.items
        ? response.items
            .map((item) => Status.fromJson(JSON.stringify(item)))
            .filter((item): item is Status => item !== null)
        : [];

    if (response.success) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Unable to get feed");
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/status/story");

    const items =
      response.success && response.items
        ? response.items
            .map((item) => Status.fromJson(JSON.stringify(item)))
            .filter((item): item is Status => item !== null)
        : [];

    if (response.success) {
      return [items, response.hasMore];
    } else {
      throw new Error(response.message ?? "Unable to get story");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    if (!response.success) {
      throw new Error(response.message ?? "Unable to post status");
    }
  }
}
