import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

// Same cleanup as Navbar. I removed repeated view field handling and reusing the shared message-capable view contract.
export interface PostStatusView extends MessageView {
  setIsLoading: (value: boolean) => void;
  clearPost: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(
    authToken: AuthToken,
    postText: string,
    currentUser: User,
  ) {
    let postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);

      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(postText, currentUser, Date.now());

      await this.service.postStatus(authToken, status);

      this.view.clearPost();
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
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
