import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  setIsLoading: (value: boolean) => void;
  clearPost: () => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private service: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.service = new StatusService();
  }

  public async submitPost(
    authToken: AuthToken,
    postText: string,
    currentUser: User,
  ) {
    let postingStatusToastId = "";

    try {
      this._view.setIsLoading(true);

      postingStatusToastId = this._view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(postText, currentUser, Date.now());

      await this.service.postStatus(authToken, status);

      this._view.clearPost();
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(postingStatusToastId);
      this._view.setIsLoading(false);
    }
  }

  public isPostDisabled(
    postText: string,
    authToken: AuthToken | null,
    currentUser: User,
  ): boolean {
    return !postText.trim() || !authToken || !currentUser;
  }
}
