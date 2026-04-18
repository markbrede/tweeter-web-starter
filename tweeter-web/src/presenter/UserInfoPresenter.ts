import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import {
  LoadingMessageView,
  LoadingMessagePresenter,
} from "./LoadingMessagePresenter";

export interface UserInfoView extends LoadingMessageView {
  setIsFollower: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
}

export class UserInfoPresenter extends LoadingMessagePresenter<UserInfoView> {
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
    await this.doFailureReportingOperation(async () => {
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
    }, "load user info");
  }

  public async followUser(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperationWithMessage(
      async () => {
        await this.followService.follow(authToken, displayedUser);

        const followeeCount = await this.followService.getFolloweeCount(
          authToken,
          displayedUser,
        );
        const followerCount = await this.followService.getFollowerCount(
          authToken,
          displayedUser,
        );

        this.view.setIsFollower(true);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "follow user",
      `Following ${displayedUser.name}...`,
    );
  }

  public async unfollowUser(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperationWithMessage(
      async () => {
        await this.followService.unfollow(authToken, displayedUser);

        const followeeCount = await this.followService.getFolloweeCount(
          authToken,
          displayedUser,
        );
        const followerCount = await this.followService.getFollowerCount(
          authToken,
          displayedUser,
        );

        this.view.setIsFollower(false);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      "unfollow user",
      `Unfollowing ${displayedUser.name}...`,
    );
  }
}
