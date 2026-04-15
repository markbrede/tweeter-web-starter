import { TweeterResponse } from "./TweeterResponse";

export class FollowActionResponse extends TweeterResponse {
  constructor(
    success: boolean,
    message: string | null,
    public followerCount: number,
    public followeeCount: number
  ) {
    super(success, message);
  }
}
