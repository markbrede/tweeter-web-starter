import { User } from "tweeter-shared";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { DAOFactoryProvider } from "../dao/factory/DAOFactoryProvider";

export class FollowService {
  public constructor(
    private readonly daoFactory: DAOFactory = DAOFactoryProvider.getDAOFactory()
  ) {}

  public async getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    return this.daoFactory
      .getFollowDAO()
      .getIsFollowerStatus(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(userAlias: string): Promise<number> {
    return this.daoFactory.getFollowDAO().getFolloweeCount(userAlias);
  }

  public async getFollowerCount(userAlias: string): Promise<number> {
    return this.daoFactory.getFollowDAO().getFollowerCount(userAlias);
  }

  public async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.daoFactory
      .getFollowDAO()
      .getFollowees(userAlias, pageSize, lastItem);
  }

  public async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.daoFactory
      .getFollowDAO()
      .getFollowers(userAlias, pageSize, lastItem);
  }

  public async follow(
    currentUserAlias: string,
    selectedUserAlias: string
  ): Promise<[number, number]> {
    if (currentUserAlias === selectedUserAlias) {
      throw new Error("bad-request: user cannot follow themselves");
    }

    const alreadyFollowing = await this.daoFactory
      .getFollowDAO()
      .getIsFollowerStatus(currentUserAlias, selectedUserAlias);

    if (alreadyFollowing) {
      throw new Error("bad-request: already following user");
    }

    const currentUser = await this.daoFactory.getUserDAO().getUser(currentUserAlias);
    const selectedUser = await this.daoFactory.getUserDAO().getUser(selectedUserAlias);

    if (!currentUser || !selectedUser) {
      throw new Error("bad-request: user not found");
    }

    return this.daoFactory.getFollowDAO().follow(currentUser, selectedUser);
  }

  public async unfollow(
    currentUserAlias: string,
    selectedUserAlias: string
  ): Promise<[number, number]> {
    if (currentUserAlias === selectedUserAlias) {
      throw new Error("bad-request: user cannot unfollow themselves");
    }

    const alreadyFollowing = await this.daoFactory
      .getFollowDAO()
      .getIsFollowerStatus(currentUserAlias, selectedUserAlias);

    if (!alreadyFollowing) {
      throw new Error("bad-request: cannot unfollow user you do not follow");
    }

    return this.daoFactory
      .getFollowDAO()
      .unfollow(currentUserAlias, selectedUserAlias);
  }
}
