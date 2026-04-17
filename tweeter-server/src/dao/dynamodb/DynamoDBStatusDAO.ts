import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import { StatusDAO } from "../interfaces/StatusDAO";
import { DynamoDBDAO } from "./DynamoDBDAO";

interface StatusItem {
  user_alias: string;
  timestamp: number;
  post: string;
  author_first_name: string;
  author_last_name: string;
  author_alias: string;
  author_image_url: string;
}

export class DynamoDBStatusDAO extends DynamoDBDAO implements StatusDAO {
  private readonly storyTableName = process.env.STORY_TABLE || "tweeter_story";
  private readonly feedTableName = process.env.FEED_TABLE || "tweeter_feed";

  public async getFeed(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.getStatusPage(this.feedTableName, userAlias, pageSize, lastItem);
  }

  public async getStory(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.getStatusPage(this.storyTableName, userAlias, pageSize, lastItem);
  }

  public async addStatusToStory(newStatus: Status): Promise<void> {
    await this.documentClient.send(
      new PutCommand({
        TableName: this.storyTableName,
        Item: this.toStatusItem(newStatus, newStatus.user.alias),
      })
    );
  }

  public async addStatusToFeed(
    newStatus: Status,
    feedOwnerAlias: string
  ): Promise<void> {
    await this.documentClient.send(
      new PutCommand({
        TableName: this.feedTableName,
        Item: this.toStatusItem(newStatus, feedOwnerAlias),
      })
    );
  }

  private async getStatusPage(
    tableName: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "user_alias = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        ScanIndexForward: false,
        ExclusiveStartKey: lastItem
          ? {
              user_alias: userAlias,
              timestamp: lastItem.timestamp,
            }
          : undefined,
        Limit: pageSize,
      })
    );

    const items =
      (response.Items as StatusItem[] | undefined)?.map((item) => {
        const user = new User(
          item.author_first_name,
          item.author_last_name,
          item.author_alias,
          item.author_image_url
        );

        return new Status(item.post, user, item.timestamp);
      }) ?? [];

    return [items, response.LastEvaluatedKey !== undefined];
  }

  private toStatusItem(newStatus: Status, userAlias: string): StatusItem {
    return {
      user_alias: userAlias,
      timestamp: newStatus.timestamp,
      post: newStatus.post,
      author_first_name: newStatus.user.firstName,
      author_last_name: newStatus.user.lastName,
      author_alias: newStatus.user.alias,
      author_image_url: newStatus.user.imageUrl,
    };
  }
}
