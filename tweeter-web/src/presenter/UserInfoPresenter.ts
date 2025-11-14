import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";

export interface UserInfoView {
  // State setters
  setIsFollower(isFollower: boolean): void;
  setFollowerCount(count: number): void;
  setFolloweeCount(count: number): void;
  setIsLoading(isLoading: boolean): void;
  setDisplayedUser(user: User): void;


  // Messaging
  displayInfoMessage(message: string, duration: number): string;
  displayErrorMessage(message: string): void;
  deleteMessage(messageId: string): void;

  // Navigation
  navigateToUser(alias: string): void;

  // Accessors
  getCurrentUser(): User | null;
  getDisplayedUser(): User | null;
  getAuthToken(): AuthToken | null;
}

export class UserInfoPresenter {
  private readonly view: UserInfoView;
  private readonly followService: FollowService;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.followService = new FollowService();
  }
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`,
      );
    }
  }

  // All follow/unfollow/load counts/navigation logic will go here.
  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }
  
  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    try {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`,
      );
    }
  }

  public onReturnToLoggedInUserClicked(): void {
    const currentUser = this.view.getCurrentUser();
    if (!currentUser) {
      return;
    }

    this.view.setDisplayedUser(currentUser);
    this.view.navigateToUser(currentUser.alias);
  }

  public async onFollowClicked(): Promise<void> {
    const authToken = this.view.getAuthToken();
    const displayedUser = this.view.getDisplayedUser();

    if (!authToken || !displayedUser) {
      return;
    }

    let followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.followService.follow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
  }

  public async onUnfollowClicked(): Promise<void> {
    const authToken = this.view.getAuthToken();
    const displayedUser = this.view.getDisplayedUser();

    if (!authToken || !displayedUser) {
      return;
    }

    let unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
  }
}
