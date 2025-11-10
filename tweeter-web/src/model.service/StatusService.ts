import { AuthToken, Status, FakeData } from "tweeter-shared";

export class StatusService {
public async loadMoreFeed(
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
): Promise<[Status[], boolean]> {
  // TODO: Replace with the result of calling the server
  return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
};

public async loadMoreStory(
  authToken: AuthToken,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
): Promise<[Status[], boolean]> {
  // TODO: Replace with the result of calling the server
  return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
}; 
}
