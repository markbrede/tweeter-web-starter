import { AuthToken, User } from "tweeter-shared";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { DAOFactoryProvider } from "../dao/factory/DAOFactoryProvider";

export class UserService {
  public constructor(
    private readonly daoFactory: DAOFactory = DAOFactoryProvider.getDAOFactory()
  ) {}

  private validateRequiredString(value: string | undefined, fieldName: string): string {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error(`bad-request: missing or empty ${fieldName}`);
    }

    return trimmed;
  }

  public async getUser(alias: string): Promise<User | null> {
    return this.daoFactory.getUserDAO().getUser(alias);
  }

  public async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
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

    const imageUrl = await this.daoFactory.getS3DAO().putImage(
      `${validatedAlias.substring(1)}-${Date.now()}.${validatedImageFileExtension}`,
      validatedImageStringBase64,
      validatedImageFileExtension
    );

    const user = await this.daoFactory.getUserDAO().registerUser(
      validatedFirstName,
      validatedLastName,
      validatedAlias,
      validatedPassword,
      imageUrl
    );

    const authToken = await this.daoFactory.getAuthDAO().createAuthToken(validatedAlias);

    return [user, authToken];
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const validatedAlias = this.validateRequiredString(alias, "alias");
    const validatedPassword = this.validateRequiredString(password, "password");

    if (!validatedAlias.startsWith("@")) {
      throw new Error("bad-request: alias must begin with @");
    }

    const user = await this.daoFactory
      .getUserDAO()
      .authenticateUser(validatedAlias, validatedPassword);

    if (user === null) {
      throw new Error("bad-request: invalid alias or password");
    }

    const authToken = await this.daoFactory.getAuthDAO().createAuthToken(user.alias);

    return [user, authToken];
  }

  public async logout(authToken: string): Promise<void> {
    const validatedAuthToken = this.validateRequiredString(authToken, "authToken");
    await this.daoFactory.getAuthDAO().deleteAuthToken(validatedAuthToken);
  }
}
