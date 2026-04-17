import { DAOFactory } from "../dao/factory/DAOFactory";
import { DAOFactoryProvider } from "../dao/factory/DAOFactoryProvider";

export class AuthorizationService {
  public constructor(
    private readonly daoFactory: DAOFactory = DAOFactoryProvider.getDAOFactory()
  ) {}

  public async authorize(authToken: string): Promise<string> {
    const alias = await this.daoFactory.getAuthDAO().getAliasForToken(authToken);

    if (!alias) {
      throw new Error("unauthorized: invalid or expired auth token");
    }

    return alias;
  }
}
