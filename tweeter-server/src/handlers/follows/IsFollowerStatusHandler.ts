import { AuthorizationService } from "../../services/AuthorizationService";
import { FollowService } from "../../services/FollowService";

interface IsFollowerStatusRequest {
  authToken: string;
  userAlias: string;
  selectedUserAlias: string;
}

export const isFollowerStatusHandler = async (
  request: IsFollowerStatusRequest
) => {
  await new AuthorizationService().authorize(request.authToken);

  const isFollower = await new FollowService().getIsFollowerStatus(
    request.userAlias,
    request.selectedUserAlias
  );

  return {
    success: true,
    isFollower: isFollower,
  };
};
