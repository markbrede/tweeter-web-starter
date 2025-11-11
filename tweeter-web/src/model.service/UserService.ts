import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
      // TODO: replace with real backend call
      const user = FakeData.instance.firstUser;
      if (user === null) {
        throw new Error("Invalid alias or password");
      }
      return [user, FakeData.instance.authToken];
    }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    file?: File
  ): Promise<[User, AuthToken]> {
    // Convert file to base64 + extension (non-UI logic)
    let imageStringBase64: string | undefined;
    let imageFileExtension: string | undefined;

    if (file) {
      const full = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string); // "data:image/png;base64,...."
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      imageStringBase64 = full.split("base64,")[1] ?? "";
      imageFileExtension = file.name.split(".").pop();
    }

    // TODO: Replace with server call later
    const user = FakeData.instance.firstUser;
    if (user === null) throw new Error("Invalid registration");
    return [user, FakeData.instance.authToken];
  }

}
