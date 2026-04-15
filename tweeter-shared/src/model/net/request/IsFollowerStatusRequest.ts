import type { TweeterRequest } from "./TweeterRequest";

export class IsFollowerStatusRequest implements TweeterRequest {
  constructor(
    public authToken: string,
    public userAlias: string,
    public selectedUserAlias: string
  ) {}
}
