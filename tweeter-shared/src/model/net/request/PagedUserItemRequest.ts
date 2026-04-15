import { User } from "../../domain/User";
import type { TweeterRequest } from "./TweeterRequest";

export class PagedUserItemRequest implements TweeterRequest {
  constructor(
    public authToken: string,
    public userAlias: string,
    public pageSize: number,
    public lastItem: User | null
  ) {}
}
