import { AuthorizationService } from "../../services/AuthorizationService";
import { FollowService } from "../../services/FollowService";

interface FollowActionRequest {
  authToken: string;
  userAlias: string;
}

export const unfollowHandler = async (request: FollowActionRequest) => {
  const currentUserAlias = await new AuthorizationService().authorize(
    request.authToken
  );

  const [followerCount, followeeCount] = await new FollowService().unfollow(
    currentUserAlias,
    request.userAlias
  );

  return {
    success: true,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
