import { UserService } from "../../services/UserService";

interface UserCreateRequest {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageStringBase64: string;
  imageFileExtension: string;
}

export const userCreateHandler = async (request: UserCreateRequest) => {
  if (!request) {
    throw new Error("bad-request: missing request");
  }

  const [user, authToken] = new UserService().createUser(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.imageStringBase64,
    request.imageFileExtension
  );

  return {
    success: true,
    user: user,
    authToken: authToken,
  };
};
