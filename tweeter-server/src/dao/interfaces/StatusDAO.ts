import { Status } from "tweeter-shared";

export interface StatusDAO {
  getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]>;
  getStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]>;
  addStatusToStory(newStatus: Status): Promise<void>;
  addStatusToFeed(newStatus: Status, feedOwnerAlias: string): Promise<void>;
}
