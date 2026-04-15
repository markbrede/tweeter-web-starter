import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
  private validateRequiredString(value: string | undefined, fieldName: string): string {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error(`bad-request: missing or empty ${fieldName}`);
    }

    return trimmed;
  }

  public getUser(alias: string): User | null {
    return FakeData.instance.findUserByAlias(alias);
  }

  public createUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): [User, AuthToken] {
    const validatedFirstName = this.validateRequiredString(firstName, "firstName");
    const validatedLastName = this.validateRequiredString(lastName, "lastName");
    const validatedAlias = this.validateRequiredString(alias, "alias");
    const validatedPassword = this.validateRequiredString(password, "password");
    const validatedImageStringBase64 = this.validateRequiredString(
      imageStringBase64,
      "imageStringBase64"
    );
    const validatedImageFileExtension = this.validateRequiredString(
      imageFileExtension,
      "imageFileExtension"
    );

    if (!validatedAlias.startsWith("@")) {
      throw new Error("bad-request: alias must begin with @");
    }

    if (validatedPassword.length === 0) {
      throw new Error("bad-request: password must not be empty");
    }

    if (validatedFirstName.length === 0 || validatedLastName.length === 0) {
      throw new Error("bad-request: firstName and lastName must not be empty");
    }

    if (validatedImageStringBase64.length === 0 || validatedImageFileExtension.length === 0) {
      throw new Error("bad-request: image data is required");
    }

    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("internal-server-error: unable to create user");
    }

    return [user, FakeData.instance.authToken];
  }

  public login(alias: string, password: string): [User, AuthToken] {
    const validatedAlias = this.validateRequiredString(alias, "alias");
    const validatedPassword = this.validateRequiredString(password, "password");

    if (!validatedAlias.startsWith("@")) {
      throw new Error("bad-request: alias must begin with @");
    }

    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("internal-server-error: unable to log user in");
    }

    return [user, FakeData.instance.authToken];
  }

  public logout(authToken: string): void {
    this.validateRequiredString(authToken, "authToken");
    return;
  }
}
