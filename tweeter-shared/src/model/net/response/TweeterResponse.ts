export class TweeterResponse {
  constructor(
    public success: boolean,
    public message: string | null = null
  ) {}
}
