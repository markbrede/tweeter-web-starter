import { DAOFactory } from "./DAOFactory";
import { DynamoDBDAOFactory } from "../dynamodb/DynamoDBDAOFactory";

export class DAOFactoryProvider {
  private static daoFactory: DAOFactory = new DynamoDBDAOFactory();

  public static getDAOFactory(): DAOFactory {
    return this.daoFactory;
  }

  public static setDAOFactory(daoFactory: DAOFactory): void {
    this.daoFactory = daoFactory;
  }
}
