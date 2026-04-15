import type { TweeterRequest } from "./TweeterRequest";

export class GetUserRequest implements TweeterRequest {
  constructor(public alias: string) {}
}
