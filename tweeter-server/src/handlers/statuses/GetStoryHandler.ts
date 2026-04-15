import { Status } from "tweeter-shared";
import { StatusService } from "../../services/StatusService";

interface PagedStatusItemRequest {
  authToken: string;
  userAlias: string;
  pageSize: number;
  lastItem: Status | null;
}

export const getStoryHandler = async (request: PagedStatusItemRequest) => {
  const lastItem = request.lastItem
    ? Status.fromJson(JSON.stringify(request.lastItem))
    : null;

  const [items, hasMore] = new StatusService().getStory(
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
