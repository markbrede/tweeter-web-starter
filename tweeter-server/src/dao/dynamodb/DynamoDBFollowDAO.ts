import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { User } from "tweeter-shared";
import { FollowDAO } from "../interfaces/FollowDAO";
import { DynamoDBDAO } from "./DynamoDBDAO";

interface FollowItem {
  follower_alias: string;
  follower_first_name: string;
  follower_last_name: string;
  follower_image_url: string;
  followee_alias: string;
  followee_first_name: string;
  followee_last_name: string;
  followee_image_url: string;
}

export class DynamoDBFollowDAO extends DynamoDBDAO implements FollowDAO {
  private readonly tableName = process.env.FOLLOWS_TABLE || "tweeter_follows";
  private readonly followerIndex = process.env.FOLLOWS_FOLLOWEE_INDEX || "followee_index";

  public async getIsFollowerStatus(
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          "follower_alias = :followerAlias AND followee_alias = :followeeAlias",
        ExpressionAttributeValues: {
          ":followerAlias": userAlias,
          ":followeeAlias": selectedUserAlias,
        },
      })
    );

    return (response.Items?.length ?? 0) > 0;
  }

  public async getFolloweeCount(userAlias: string): Promise<number> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "follower_alias = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        Select: "COUNT",
      })
    );

    return response.Count ?? 0;
  }

  public async getFollowerCount(userAlias: string): Promise<number> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.followerIndex,
        KeyConditionExpression: "followee_alias = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        Select: "COUNT",
      })
    );

    return response.Count ?? 0;
  }

  public async getFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "follower_alias = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        ExclusiveStartKey: lastItem
          ? {
              follower_alias: userAlias,
              followee_alias: lastItem.alias,
            }
          : undefined,
        Limit: pageSize,
      })
    );

    const items =
      (response.Items as FollowItem[] | undefined)?.map(
        (item) =>
          new User(
            item.followee_first_name,
            item.followee_last_name,
            item.followee_alias,
            item.followee_image_url
          )
      ) ?? [];

    return [items, response.LastEvaluatedKey !== undefined];
  }

  public async getFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const response = await this.documentClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: this.followerIndex,
        KeyConditionExpression: "followee_alias = :alias",
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        ExclusiveStartKey: lastItem
          ? {
              followee_alias: userAlias,
              follower_alias: lastItem.alias,
            }
          : undefined,
        Limit: pageSize,
      })
    );

    const items =
      (response.Items as FollowItem[] | undefined)?.map(
        (item) =>
          new User(
            item.follower_first_name,
            item.follower_last_name,
            item.follower_alias,
            item.follower_image_url
          )
      ) ?? [];

    return [items, response.LastEvaluatedKey !== undefined];
  }

  public async follow(follower: User, followee: User): Promise<[number, number]> {
    await this.documentClient.send(
      new PutCommand({
        TableName: this.tableName,
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
      })
    );

    const followerCount = await this.getFollowerCount(followee.alias);
    const followeeCount = await this.getFolloweeCount(follower.alias);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<[number, number]> {
    await this.documentClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          follower_alias: followerAlias,
          followee_alias: followeeAlias,
        },
      })
    );

    const followerCount = await this.getFollowerCount(followeeAlias);
    const followeeCount = await this.getFolloweeCount(followerAlias);

    return [followerCount, followeeCount];
  }
}
