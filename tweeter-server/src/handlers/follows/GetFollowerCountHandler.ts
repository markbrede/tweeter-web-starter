import { FollowService } from "../../services/FollowService";

interface UserCountRequest {
  authToken: string;
  userAlias: string;
}

export const getFollowerCountHandler = async (request: UserCountRequest) => {
  const count = await new FollowService().getFollowerCount(request.userAlias);

  return {
    success: true,
    count: count,
  };
};
