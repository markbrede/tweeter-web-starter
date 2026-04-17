import { DAOFactory } from "../factory/DAOFactory";
import { AuthDAO } from "../interfaces/AuthDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDBAuthDAO } from "./DynamoDBAuthDAO";
import { DynamoDBFollowDAO } from "./DynamoDBFollowDAO";
import { DynamoDBStatusDAO } from "./DynamoDBStatusDAO";
import { DynamoDBUserDAO } from "./DynamoDBUserDAO";
import { S3ImageDAO } from "./S3ImageDAO";

export class DynamoDBDAOFactory implements DAOFactory {
  private readonly userDAO: UserDAO = new DynamoDBUserDAO();
  private readonly authDAO: AuthDAO = new DynamoDBAuthDAO();
  private readonly followDAO: FollowDAO = new DynamoDBFollowDAO();
  private readonly statusDAO: StatusDAO = new DynamoDBStatusDAO();
  private readonly s3DAO: S3DAO = new S3ImageDAO();

  public getUserDAO(): UserDAO {
    return this.userDAO;
  }

  public getAuthDAO(): AuthDAO {
    return this.authDAO;
  }

  public getFollowDAO(): FollowDAO {
    return this.followDAO;
  }

  public getStatusDAO(): StatusDAO {
    return this.statusDAO;
  }

  public getS3DAO(): S3DAO {
    return this.s3DAO;
  }
}
