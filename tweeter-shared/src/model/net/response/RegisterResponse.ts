import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class RegisterResponse extends TweeterResponse {
  constructor(
    success: boolean,
    message: string | null,
    public user: User | null,
    public authToken: AuthToken | null
  ) {
    super(success, message);
  }
}
