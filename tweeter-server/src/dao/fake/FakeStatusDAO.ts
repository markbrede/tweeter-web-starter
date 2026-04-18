import { FakeData, Status } from "tweeter-shared";
import { StatusDAO } from "../interfaces/StatusDAO";

export class FakeStatusDAO implements StatusDAO {
  public async getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async getStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public async addStatusToStory(newStatus: Status): Promise<void> {
    return;
  }

  public async addStatusToFeed(
    newStatus: Status,
    feedOwnerAlias: string
  ): Promise<void> {
    return;
  }

  public async addStatusToFeeds(
    newStatus: Status,
    feedOwnerAliases: string[]
  ): Promise<void> {
    for (const alias of feedOwnerAliases) {
      await this.addStatusToFeed(newStatus, alias);
    }
  }
}