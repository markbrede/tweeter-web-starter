import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
  setIsFollower: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
  setIsLoading: (value: boolean) => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}

export class UserInfoPresenter {
  private _view: UserInfoView;
  private followService: FollowService;

  constructor(view: UserInfoView) {
    this._view = view;
    this.followService = new FollowService();
  }

  public async loadUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    try {
      if (currentUser.equals(displayedUser)) {
        this._view.setIsFollower(false);
      } else {
        const isFollower = await this.followService.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser,
        );

        this._view.setIsFollower(isFollower);
      }

      const followeeCount = await this.followService.getFolloweeCount(
        authToken,
        displayedUser,
      );

      const followerCount = await this.followService.getFollowerCount(
        authToken,
        displayedUser,
      );

      this._view.setFolloweeCount(followeeCount);
      this._view.setFollowerCount(followerCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to load user info because of exception: ${error}`,
      );
    }
  }

  public async followUser(authToken: AuthToken, displayedUser: User) {
    let toastId = "";

    try {
      this._view.setIsLoading(true);

      toastId = this._view.displayInfoMessage(
        `Following ${displayedUser.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken,
        displayedUser,
      );

      this._view.setIsFollower(true);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(toastId);
      this._view.setIsLoading(false);
    }
  }

  public async unfollowUser(authToken: AuthToken, displayedUser: User) {
    let toastId = "";

    try {
      this._view.setIsLoading(true);

      toastId = this._view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken,
        displayedUser,
      );

      this._view.setIsFollower(false);
      this._view.setFollowerCount(followerCount);
      this._view.setFolloweeCount(followeeCount);
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this._view.deleteMessage(toastId);
      this._view.setIsLoading(false);
    }
  }
}
