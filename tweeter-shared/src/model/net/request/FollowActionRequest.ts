import type { TweeterRequest } from "./TweeterRequest";

export class FollowActionRequest implements TweeterRequest {
  constructor(
    public authToken: string,
    public userAlias: string
  ) {}
}
