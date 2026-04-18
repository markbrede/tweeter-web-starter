import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import {
  LoadingMessageView,
  LoadingMessagePresenter,
} from "./LoadingMessagePresenter";

export interface PostStatusView extends LoadingMessageView {
  clearPost: () => void;
}

export class PostStatusPresenter extends LoadingMessagePresenter<PostStatusView> {
  private _service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._service = new StatusService();
  }

  public get service(): StatusService {
    return this._service;
  }

  public async submitPost(
    authToken: AuthToken,
    postText: string,
    currentUser: User,
  ) {
    await this.doFailureReportingOperationWithMessage(
      async () => {
        const status = new Status(postText, currentUser, Date.now());

        await this.service.postStatus(authToken, status);

        this.view.clearPost();
        this.view.displayInfoMessage("Successfully Posted!", 2000);
      },
      "post the status",
      "Posting status...",
    );
  }

  public isPostDisabled(
    postText: string,
    authToken: AuthToken | null,
    currentUser: User,
  ): boolean {
    return !postText.trim() || !authToken || !currentUser;
  }
}
