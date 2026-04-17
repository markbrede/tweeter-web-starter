import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../interfaces/AuthDAO";
import { DynamoDBDAO } from "./DynamoDBDAO";

interface AuthItem {
  token: string;
  alias: string;
  timestamp: number;
}

export class DynamoDBAuthDAO extends DynamoDBDAO implements AuthDAO {
  private readonly tableName = process.env.AUTH_TABLE || "auth";
  private readonly timeoutMinutes = Number(process.env.AUTH_TIMEOUT_MINUTES || "60");

  public async createAuthToken(alias: string): Promise<AuthToken> {
    const authToken = AuthToken.Generate();

    await this.documentClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          token: authToken.token,
          alias,
          timestamp: authToken.timestamp,
        },
      })
    );

    return authToken;
  }

  public async deleteAuthToken(token: string): Promise<void> {
    await this.documentClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );
  }

  public async getAliasForToken(token: string): Promise<string | null> {
    const response = await this.documentClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );

    const item = response.Item as AuthItem | undefined;
    if (!item) {
      return null;
    }

    const expired =
      Date.now() - item.timestamp > this.timeoutMinutes * 60 * 1000;

    if (expired) {
      await this.deleteAuthToken(token);
      return null;
    }

    await this.documentClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { token },
        UpdateExpression: "SET #ts = :timestamp",
        ExpressionAttributeNames: {
          "#ts": "timestamp",
        },
        ExpressionAttributeValues: {
          ":timestamp": Date.now(),
        },
      })
    );

    return item.alias;
  }
}
