import type { SQSEvent } from "aws-lambda";
import { Status, User } from "tweeter-shared";
import { FollowService } from "../../services/FollowService";
import { QueueService } from "../../services/QueueService";

interface PostStatusQueueMessage {
  status: Status;
}

const FOLLOWERS_PAGE_SIZE = 25;

export const postUpdateFeedMessagesHandler = async (event: SQSEvent) => {
  const followService = new FollowService();
  const queueService = new QueueService();

  for (const record of event.Records) {
    const body = JSON.parse(record.body) as PostStatusQueueMessage;
    const status = Status.fromJson(JSON.stringify(body.status));

    if (!status) {
      throw new Error("bad-request: invalid status message");
    }

    let lastItem: User | null = null;
    let hasMore = false;

    do {
      const [followers, more] = await followService.getFollowers(
        status.user.alias,
        FOLLOWERS_PAGE_SIZE,
        lastItem
      );

      const followerAliases = followers.map((follower) => follower.alias);

      await queueService.sendUpdateFeedMessage(status, followerAliases);

      hasMore = more;
      lastItem = followers.length > 0 ? followers[followers.length - 1] : null;
    } while (hasMore);
  }
};
