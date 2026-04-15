import { Status } from "tweeter-shared";
import { StatusService } from "../../services/StatusService";

interface PostStatusRequest {
  authToken: string;
  newStatus: Status;
}

export const postStatusHandler = async (request: PostStatusRequest) => {
  const status = Status.fromJson(JSON.stringify(request.newStatus));

  if (!status) {
    throw new Error("bad-request: invalid status");
  }

  new StatusService().postStatus(status);

  return {
    success: true,
  };
};
