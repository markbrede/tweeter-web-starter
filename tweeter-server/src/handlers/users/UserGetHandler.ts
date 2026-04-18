import { UserService } from "../../services/UserService";

interface UserGetRequest {
  authToken: string;
  alias: string;
}

export const userGetHandler = async (request: UserGetRequest) => {
  const user = await new UserService().getUser(request.alias);

  if (user === null) {
    throw new Error("bad-request: user not found");
  }

  return {
    success: true,
    user: user,
  };
};
