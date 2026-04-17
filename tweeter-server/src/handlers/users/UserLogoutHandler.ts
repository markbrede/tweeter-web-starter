import { AuthorizationService } from "../../services/AuthorizationService";
import { UserService } from "../../services/UserService";

interface LogoutRequest {
  authToken: string;
}

export const userLogoutHandler = async (request: LogoutRequest) => {
  await new AuthorizationService().authorize(request.authToken);
  await new UserService().logout(request.authToken);

  return {
    success: true,
  };
};
