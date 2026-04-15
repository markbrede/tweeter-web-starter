import { TweeterResponse } from "./TweeterResponse";

export class UserCountResponse extends TweeterResponse {
  constructor(
    success: boolean,
    message: string | null,
    public count: number
  ) {
    super(success, message);
  }
}
