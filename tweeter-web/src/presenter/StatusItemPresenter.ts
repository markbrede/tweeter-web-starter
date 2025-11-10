import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export class StatusItemPresenter {
  private view: StatusItemView;
  private service: StatusService;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private mode: "feed" | "story";
  private static readonly PAGE_SIZE = 10;

  constructor(view: StatusItemView, mode: "feed" | "story") {
    this.view = view;
    this.service = new StatusService();
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
}
