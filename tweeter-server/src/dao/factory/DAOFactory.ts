import { AuthDAO } from "../interfaces/AuthDAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { UserDAO } from "../interfaces/UserDAO";

export interface DAOFactory {
  getUserDAO(): UserDAO;
  getAuthDAO(): AuthDAO;
  getFollowDAO(): FollowDAO;
  getStatusDAO(): StatusDAO;
  getS3DAO(): S3DAO;
}
