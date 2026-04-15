import type { TweeterRequest } from "./TweeterRequest";

export class LogoutRequest implements TweeterRequest {
  constructor(public authToken: string) {}
}
