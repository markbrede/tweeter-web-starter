import { Status, User } from "tweeter-shared";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { DAOFactoryProvider } from "../dao/factory/DAOFactoryProvider";

export class StatusService {
  public constructor(
    private readonly daoFactory: DAOFactory = DAOFactoryProvider.getDAOFactory()
  ) {}

  public async getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.daoFactory.getStatusDAO().getFeed(userAlias, pageSize, lastItem);
  }

  public async getStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.daoFactory.getStatusDAO().getStory(userAlias, pageSize, lastItem);
  }

  public async postStatus(newStatus: Status): Promise<void> {
    await this.daoFactory.getStatusDAO().addStatusToStory(newStatus);

    let lastItem: User | null = null;
    let hasMore = false;

    do {
      const [followers, more] = await this.daoFactory
        .getFollowDAO()
        .getFollowers(newStatus.user.alias, 25, lastItem);

      for (const follower of followers) {
        await this.daoFactory
          .getStatusDAO()
          .addStatusToFeed(newStatus, follower.alias);
      }

      hasMore = more;
      lastItem = followers.length > 0 ? followers[followers.length - 1] : null;
    } while (hasMore);
  }
}
