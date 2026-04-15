import { FollowService } from "../../services/FollowService";

interface UserCountRequest {
  authToken: string;
  userAlias: string;
}

export const getFolloweeCountHandler = async (request: UserCountRequest) => {
  const count = new FollowService().getFolloweeCount(request.userAlias);

  return {
    success: true,
    count: count,
  };
};
