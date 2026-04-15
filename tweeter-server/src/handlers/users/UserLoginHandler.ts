import { UserService } from "../../services/UserService";

interface UserLoginRequest {
  alias: string;
  password: string;
}

export const userLoginHandler = async (request: UserLoginRequest) => {
  if (!request) {
    throw new Error("bad-request: missing request");
  }

  const [user, authToken] = new UserService().login(
    request.alias,
    request.password
  );

  return {
    success: true,
    user: user,
    authToken: authToken,
  };
};
