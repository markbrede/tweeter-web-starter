import type { SQSEvent } from "aws-lambda";
import { Status } from "tweeter-shared";
import { StatusService } from "../../services/StatusService";

interface UpdateFeedQueueMessage {
  status: Status;
  followerAliases: string[];
}

export const updateFeedsHandler = async (event: SQSEvent) => {
  const statusService = new StatusService();

  for (const record of event.Records) {
    const body = JSON.parse(record.body) as UpdateFeedQueueMessage;
    const status = Status.fromJson(JSON.stringify(body.status));

    if (!status) {
      throw new Error("bad-request: invalid status message");
    }

    await statusService.addStatusToFeeds(status, body.followerAliases ?? []);
  }
};
