import { AuthorizationService } from "../../services/AuthorizationService";
import { FollowService } from "../../services/FollowService";

interface UserCountRequest {
  authToken: string;
  userAlias: string;
}

export const getFollowerCountHandler = async (request: UserCountRequest) => {
  await new AuthorizationService().authorize(request.authToken);

  const count = await new FollowService().getFollowerCount(request.userAlias);

  return {
    success: true,
    count: count,
  };
};
