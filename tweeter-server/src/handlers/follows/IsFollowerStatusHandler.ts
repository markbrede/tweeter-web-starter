import { FollowService } from "../../services/FollowService";

interface IsFollowerStatusRequest {
  authToken: string;
  userAlias: string;
  selectedUserAlias: string;
}

export const isFollowerStatusHandler = async (
  request: IsFollowerStatusRequest
) => {
  const isFollower = new FollowService().getIsFollowerStatus(
    request.userAlias,
    request.selectedUserAlias
  );

  return {
    success: true,
    isFollower: isFollower,
  };
};
