import { AuthorizationService } from "../../services/AuthorizationService";
import { FollowService } from "../../services/FollowService";

interface UserCountRequest {
  authToken: string;
  userAlias: string;
}

export const getFolloweeCountHandler = async (request: UserCountRequest) => {
  await new AuthorizationService().authorize(request.authToken);

  const count = await new FollowService().getFolloweeCount(request.userAlias);

  return {
    success: true,
    count: count,
  };
};
