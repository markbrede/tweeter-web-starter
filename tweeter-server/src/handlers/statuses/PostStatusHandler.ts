import { Status } from "tweeter-shared";
import { AuthorizationService } from "../../services/AuthorizationService";
import { QueueService } from "../../services/QueueService";
import { StatusService } from "../../services/StatusService";

interface PostStatusRequest {
  authToken: string;
  newStatus: Status;
}

export const postStatusHandler = async (request: PostStatusRequest) => {
  await new AuthorizationService().authorize(request.authToken);

  const status = Status.fromJson(JSON.stringify(request.newStatus));

  if (!status) {
    throw new Error("bad-request: invalid status");
  }

  await new StatusService().postStatus(status);
  await new QueueService().sendPostStatusMessage(status);

  return {
    success: true,
  };
};
