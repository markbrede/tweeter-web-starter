import { Status } from "../../domain/Status";
import type { TweeterRequest } from "./TweeterRequest";

export class PostStatusRequest implements TweeterRequest {
  constructor(
    public authToken: string,
    public newStatus: Status
  ) {}
}
