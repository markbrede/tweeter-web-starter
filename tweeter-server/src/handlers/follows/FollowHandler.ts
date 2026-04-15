import { FollowService } from "../../services/FollowService";

interface FollowActionRequest {
  authToken: string;
  userAlias: string;
}

export const followHandler = async (request: FollowActionRequest) => {
  const [followerCount, followeeCount] = new FollowService().follow(
    request.userAlias
  );

  return {
    success: true,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
