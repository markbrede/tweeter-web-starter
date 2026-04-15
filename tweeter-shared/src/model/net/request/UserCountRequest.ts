import type { TweeterRequest } from "./TweeterRequest";

export class UserCountRequest implements TweeterRequest {
  constructor(
    public authToken: string,
    public userAlias: string
  ) {}
}
