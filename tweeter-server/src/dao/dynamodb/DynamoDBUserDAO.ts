import bcrypt from "bcryptjs";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { UserDAO } from "../interfaces/UserDAO";
import { DynamoDBDAO } from "./DynamoDBDAO";

interface UserItem {
  alias: string;
  first_name: string;
  last_name: string;
  image_url: string;
  password_hash: string;
}

export class DynamoDBUserDAO extends DynamoDBDAO implements UserDAO {
  private readonly tableName = process.env.USERS_TABLE || "users";

  public async getUser(alias: string): Promise<User | null> {
    const response = await this.documentClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      })
    );

    const item = response.Item as UserItem | undefined;
    if (!item) {
      return null;
    }

    return new User(item.first_name, item.last_name, item.alias, item.image_url);
  }

  public async registerUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<User> {
    const passwordHash = bcrypt.hashSync(password, 10);

    await this.documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          alias,
          first_name: firstName,
          last_name: lastName,
          image_url: imageUrl,
          password_hash: passwordHash,
        },
        ConditionExpression: "attribute_not_exists(alias)",
      })
    );

    return new User(firstName, lastName, alias, imageUrl);
  }

  public async authenticateUser(
    alias: string,
    password: string
  ): Promise<User | null> {
    const response = await this.documentClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      })
    );

    const item = response.Item as UserItem | undefined;
    if (!item) {
      return null;
    }

    const matches = bcrypt.compareSync(password, item.password_hash);
    if (!matches) {
      return null;
    }

    return new User(item.first_name, item.last_name, item.alias, item.image_url);
  }
}
