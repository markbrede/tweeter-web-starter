export class GetUserRequest {
  private _authToken: string;
  private _alias: string;

  public constructor(authToken: string, alias: string) {
    this._authToken = authToken;
    this._alias = alias;
  }

  public get authToken(): string {
    return this._authToken;
  }

  public get alias(): string {
    return this._alias;
  }
}
