import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public constructor(view: LoginView) {
    super(view);
  }

  public isSubmitDisabled(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public async submitLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined,
  ) {
    await this.doAuthenticationOperation(
      async () => this.userService.login(alias, password),
      rememberMe,
      (user) => originalUrl ?? `/feed/${user.alias}`,
      "log user in",
    );
  }
}
