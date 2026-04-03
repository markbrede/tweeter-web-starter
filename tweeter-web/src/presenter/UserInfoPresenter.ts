import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

// Same exact inheritance cleanup. The internal follow/unfollow duplication is still there, but I will not fix that yet.
export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
  setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async loadUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    try {
      if (currentUser.equals(displayedUser)) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.followService.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser,
        );

        this.view.setIsFollower(isFollower);
      }

      const followeeCount = await this.followService.getFolloweeCount(
        authToken,
        displayedUser,
      );

      const followerCount = await this.followService.getFollowerCount(
        authToken,
        displayedUser,
      );

      this.view.setFolloweeCount(followeeCount);
      this.view.setFollowerCount(followerCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load user info because of exception: ${error}`,
      );
    }
  }

  public async followUser(authToken: AuthToken, displayedUser: User) {
    let toastId = "";

    try {
      this.view.setIsLoading(true);

      toastId = this.view.displayInfoMessage(
        `Following ${displayedUser.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken,
        displayedUser,
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(toastId);
      this.view.setIsLoading(false);
    }
  }

  public async unfollowUser(authToken: AuthToken, displayedUser: User) {
    let toastId = "";

    try {
      this.view.setIsLoading(true);

      toastId = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken,
        displayedUser,
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(toastId);
      this.view.setIsLoading(false);
    }
  }
}
