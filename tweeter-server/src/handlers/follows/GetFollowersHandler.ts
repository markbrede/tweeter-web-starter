import { User } from "tweeter-shared";
import { FollowService } from "../../services/FollowService";

interface PagedUserItemRequest {
  authToken: string;
  userAlias: string;
  pageSize: number;
  lastItem: User | null;
}

export const getFollowersHandler = async (request: PagedUserItemRequest) => {
  const lastItem = request.lastItem
    ? User.fromJson(JSON.stringify(request.lastItem))
    : null;

  const [items, hasMore] = new FollowService().getFollowers(
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
