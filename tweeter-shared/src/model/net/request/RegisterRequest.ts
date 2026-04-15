import type { TweeterRequest } from "./TweeterRequest";

export class RegisterRequest implements TweeterRequest {
  constructor(
    public firstName: string,
    public lastName: string,
    public alias: string,
    public password: string,
    public imageStringBase64: string,
    public imageFileExtension: string
  ) {}
}
