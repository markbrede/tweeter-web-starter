import type { TweeterRequest } from "./TweeterRequest";

export class GetUserRequest implements TweeterRequest {
  constructor(public authToken: string, public alias: string) {}
}
