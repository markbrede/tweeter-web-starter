import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
  setBusy(isBusy: boolean): void;
  showError(message: string): void;
  onRegistered(user: User, token: AuthToken, rememberMe: boolean): void;
  navigateAfterRegister(user: User): void;
}

export class RegisterPresenter {
  private readonly view: RegisterView;
  private readonly userService: UserService;

  constructor(view: RegisterView, userService = new UserService()) {
    this.view = view;
    this.userService = userService;
  }

  // moved from checkSubmitButtonStatus: presenter owns validation
  canSubmit(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    file?: File
  ): boolean {
    return !!firstName && !!lastName && !!alias && !!password && !!file;
  }

    public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean,
    file?: File
    ): Promise<void> {
    this.view.setBusy(true);
    try {
        const [user, token] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        file
        );

        this.view.onRegistered(user, token, rememberMe);
        this.view.navigateAfterRegister(user);
    } catch (e: any) {
        this.view.showError(e?.message ?? "Failed to register.");
    } finally {
        this.view.setBusy(false);
    }
    }
}
