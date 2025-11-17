import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class StatusItemPresenter {
  private view: StatusItemView;
  private service: StatusService;
  private userService: UserService;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private mode: "feed" | "story";
  private static readonly PAGE_SIZE = 10;

  constructor(view: StatusItemView, mode: "feed" | "story") {
    this.view = view;
    this.service = new StatusService();
    this.userService = new UserService();
    this.mode = mode;
  }

  get hasMoreItems() {
    return this._hasMoreItems;
  }
  private set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  private get lastItem() {
    return this._lastItem;
  }
  private set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const loader =
        this.mode === "feed"
          ? this.service.loadMoreFeed.bind(this.service)
          : this.service.loadMoreStory.bind(this.service);

      const [newItems, hasMore] = await loader(
        authToken,
        userAlias,
        StatusItemPresenter.PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this.mode} because of exception: ${error}`
      );
    }
  }

  async syncDisplayedUserFromRoute(
    authToken: AuthToken | null,
    displayedUserAliasParam: string | undefined,
    displayedUser: User | null
  ): Promise<void> {
    // Guard conditions: if we don't have what we need, do nothing.
    if (
      !authToken ||
      !displayedUserAliasParam ||
      (displayedUser && displayedUserAliasParam === displayedUser.alias)
    ) {
      return;
    }

    try {
      const toUser = await this.userService.getUser(
        authToken,
        displayedUserAliasParam
      );

      if (toUser) {
        this.view.setDisplayedUser(toUser);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load user because of exception: ${error}`
      );
    }
  }
}
