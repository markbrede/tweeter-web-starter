import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AuthView {
  setBusy(isBusy: boolean): void;
  showError(message: string): void;
  onLoggedIn(user: User, token: AuthToken, rememberMe: boolean): void;
  navigateAfterLogin(user: User, originalUrl?: string): void;
}

export class AuthPresenter {
  private readonly view: AuthView;
  private readonly userService: UserService;

  constructor(view: AuthView, userService = new UserService()) {
    this.view = view;
    this.userService = userService;
  }

  async login(alias: string, password: string, rememberMe: boolean, originalUrl?: string): Promise<void> {
    if (!alias || !password) {
      this.view.showError("Alias and password are required.");
      return;
    }

    this.view.setBusy(true);
    try {
      const [user, token] = await this.userService.login(alias, password);
      this.view.onLoggedIn(user, token, rememberMe);
      this.view.navigateAfterLogin(user, originalUrl);
    } catch (e: any) {
      this.view.showError(e?.message ?? "Failed to log in.");
    } finally {
      this.view.setBusy(false);
    }
  }
}