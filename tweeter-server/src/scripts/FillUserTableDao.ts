import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { User } from "tweeter-shared";

export class FillUserTableDao {
  private readonly tableName = process.env.USERS_TABLE || "tweeter_users";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  public async getUser(alias: string): Promise<User | null> {
    const response = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      })
    );

    const item = response.Item as
      | {
          alias: string;
          first_name: string;
          last_name: string;
          image_url: string;
        }
      | undefined;

    if (!item) {
      return null;
    }

    return new User(item.first_name, item.last_name, item.alias, item.image_url);
  }

  public async createUsers(userList: User[], password: string): Promise<void> {
    if (userList.length === 0) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const params: BatchWriteCommandInput = {
      RequestItems: {
        [this.tableName]: userList.map((user) => ({
          PutRequest: {
            Item: {
              alias: user.alias,
              first_name: user.firstName,
              last_name: user.lastName,
              image_url: user.imageUrl,
              password_hash: passwordHash,
            },
          },
        })),
      },
    };

    let response = await this.client.send(new BatchWriteCommand(params));
    await this.putUnprocessedItems(response, params);
  }

  private async putUnprocessedItems(
    response: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ): Promise<void> {
    let delay = 10;

    while (
      response.UnprocessedItems !== undefined &&
      Object.keys(response.UnprocessedItems).length > 0
    ) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (delay < 1000) {
        delay += 100;
      }

      params.RequestItems = response.UnprocessedItems;
      response = await this.client.send(new BatchWriteCommand(params));
    }
  }
}
