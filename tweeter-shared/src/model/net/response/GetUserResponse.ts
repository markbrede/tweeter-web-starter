import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class GetUserResponse extends TweeterResponse {
  constructor(
    success: boolean,
    message: string | null,
    public user: User | null
  ) {
    super(success, message);
  }
}
