import { Status } from "tweeter-shared";
import { AuthorizationService } from "../../services/AuthorizationService";
import { StatusService } from "../../services/StatusService";

interface PagedStatusItemRequest {
  authToken: string;
  userAlias: string;
  pageSize: number;
  lastItem: Status | null;
}

export const getFeedHandler = async (request: PagedStatusItemRequest) => {
  await new AuthorizationService().authorize(request.authToken);

  const lastItem = request.lastItem
    ? Status.fromJson(JSON.stringify(request.lastItem))
    : null;

  const [items, hasMore] = await new StatusService().getFeed(
    request.userAlias,
    request.pageSize,
    lastItem
  );

  return {
    success: true,
    items: items,
    hasMore: hasMore,
  };
};
