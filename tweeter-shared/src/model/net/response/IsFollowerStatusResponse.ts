import { TweeterResponse } from "./TweeterResponse";

export class IsFollowerStatusResponse extends TweeterResponse {
  constructor(
    success: boolean,
    message: string | null,
    public isFollower: boolean
  ) {
    super(success, message);
  }
}
