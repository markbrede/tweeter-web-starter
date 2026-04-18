import { Status } from "tweeter-shared";
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
  }

  public async addStatusToFeeds(
    newStatus: Status,
    feedOwnerAliases: string[]
  ): Promise<void> {
    await this.daoFactory
      .getStatusDAO()
      .addStatusToFeeds(newStatus, feedOwnerAliases);
  }
}
