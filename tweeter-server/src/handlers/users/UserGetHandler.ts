import { UserService } from "../../services/UserService";

interface UserGetRequest {
  alias: string;
}

export const userGetHandler = async (request: UserGetRequest) => {
  const user = new UserService().getUser(request.alias);

  if (user === null) {
    throw new Error("bad-request: user not found");
  }

  return {
    success: true,
    user: user,
  };
};
