import {
  AuthToken,
  PagedStatusItemRequest,
  PostStatusRequest,
  Status,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../model.net/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedStatuses(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreFeedItems(
      new PagedStatusItemRequest(authToken.token, userAlias, pageSize, lastItem)
    );
  }

  public async loadMoreStoryStatuses(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreStoryItems(
      new PagedStatusItemRequest(authToken.token, userAlias, pageSize, lastItem)
    );
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    return this.serverFacade.postStatus(
      new PostStatusRequest(authToken.token, newStatus)
    );
  }
}
