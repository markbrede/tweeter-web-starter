import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export abstract class DynamoDBDAO {
  private static readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" })
  );

  protected get documentClient(): DynamoDBDocumentClient {
    return DynamoDBDAO.client;
  }
}
