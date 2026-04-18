import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { Status } from "tweeter-shared";

interface PostStatusQueueMessage {
  status: Status;
}

interface UpdateFeedQueueMessage {
  status: Status;
  followerAliases: string[];
}

export class QueueService {
  private readonly sqsClient = new SQSClient({});

  private readonly postStatusQueueUrl = process.env.POST_STATUS_QUEUE_URL;
  private readonly updateFeedQueueUrl = process.env.UPDATE_FEED_QUEUE_URL;

  private requireQueueUrl(name: string, value: string | undefined): string {
    if (!value) {
      throw new Error(`internal-server-error: missing ${name}`);
    }

    return value;
  }

  public async sendPostStatusMessage(status: Status): Promise<void> {
    const message: PostStatusQueueMessage = { status };

    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.requireQueueUrl(
          "POST_STATUS_QUEUE_URL",
          this.postStatusQueueUrl
        ),
        MessageBody: JSON.stringify(message),
      })
    );
  }

  public async sendUpdateFeedMessage(
    status: Status,
    followerAliases: string[]
  ): Promise<void> {
    if (followerAliases.length === 0) {
      return;
    }

    const message: UpdateFeedQueueMessage = {
      status,
      followerAliases,
    };

    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.requireQueueUrl(
          "UPDATE_FEED_QUEUE_URL",
          this.updateFeedQueueUrl
        ),
        MessageBody: JSON.stringify(message),
      })
    );
  }
}
