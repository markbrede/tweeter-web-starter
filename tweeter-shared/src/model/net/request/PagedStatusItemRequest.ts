import { Status } from "../../domain/Status";
import type { TweeterRequest } from "./TweeterRequest";

export class PagedStatusItemRequest implements TweeterRequest {
  constructor(
    public authToken: string,
    public userAlias: string,
    public pageSize: number,
    public lastItem: Status | null
  ) {}
}
