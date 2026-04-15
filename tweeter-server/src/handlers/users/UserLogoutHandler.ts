import { UserService } from "../../services/UserService";

interface LogoutRequest {
  authToken: string;
}

export const userLogoutHandler = async (request: LogoutRequest) => {
  new UserService().logout(request.authToken);

  return {
    success: true,
  };
};
