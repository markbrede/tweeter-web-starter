import type { TweeterRequest } from "./TweeterRequest";

export class LoginRequest implements TweeterRequest {
  constructor(
    public alias: string,
    public password: string
  ) {}
}
