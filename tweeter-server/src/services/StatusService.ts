import { FakeData, Status } from "tweeter-shared";

export class StatusService {
  public getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): [Status[], boolean] {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public getStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): [Status[], boolean] {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  }

  public postStatus(newStatus: Status): void {
    return;
  }
}
