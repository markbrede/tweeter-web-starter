import { DAOFactory } from "../factory/DAOFactory";
import { AuthDAO } from "../interfaces/AuthDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";
import { FakeAuthDAO } from "./FakeAuthDAO";
import { FakeFollowDAO } from "./FakeFollowDAO";
import { FakeS3DAO } from "./FakeS3DAO";
import { FakeStatusDAO } from "./FakeStatusDAO";
import { FakeUserDAO } from "./FakeUserDAO";

export class FakeDAOFactory implements DAOFactory {
  private readonly userDAO: UserDAO = new FakeUserDAO();
  private readonly authDAO: AuthDAO = new FakeAuthDAO();
  private readonly followDAO: FollowDAO = new FakeFollowDAO();
  private readonly statusDAO: StatusDAO = new FakeStatusDAO();
  private readonly s3DAO: S3DAO = new FakeS3DAO();

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
