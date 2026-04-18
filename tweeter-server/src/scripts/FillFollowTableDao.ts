import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";

export class FillFollowTableDao {
  private readonly tableName = process.env.FOLLOWS_TABLE || "tweeter_follows";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  public async createFollows(followee: User, followers: User[]): Promise<void> {
    if (followers.length === 0) {
      return;
    }

    const params: BatchWriteCommandInput = {
      RequestItems: {
        [this.tableName]: followers.map((follower) => ({
          PutRequest: {
            Item: {
              follower_alias: follower.alias,
              follower_first_name: follower.firstName,
              follower_last_name: follower.lastName,
              follower_image_url: follower.imageUrl,
              followee_alias: followee.alias,
              followee_first_name: followee.firstName,
              followee_last_name: followee.lastName,
              followee_image_url: followee.imageUrl,
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
