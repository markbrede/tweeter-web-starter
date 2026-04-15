import {
  GetUserRequest,
  LoginRequest,
  RegisterRequest,
  Status,
  User,
} from "tweeter-shared";
import { AuthToken } from "tweeter-shared";
import { ServerFacade } from "../../src/model.net/ServerFacade";

describe("ServerFacade", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    (globalThis as any).fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockReset();
    delete (globalThis as any).fetch;
    jest.restoreAllMocks();
  });

  it("getUser posts to /user/get and returns the parsed user", async () => {
    const user = new User("Allen", "Anderson", "@allen", "image-url");

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: user,
      }),
    } as any);

    const facade = new ServerFacade();
    const result = await facade.getUser(new GetUserRequest("@allen"));

    expect(result?.alias).toBe("@allen");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/get"),
      expect.objectContaining({ method: "POST" })
    );

    const options = mockFetch.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(options.body as string)).toMatchObject({
      alias: "@allen",
    });
  });

  it("login posts to /user/login and returns parsed user and auth token", async () => {
    const user = new User("Allen", "Anderson", "@allen", "image-url");
    const authToken = new AuthToken("token123", 111);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: user,
        authToken: authToken,
      }),
    } as any);

    const facade = new ServerFacade();
    const [resultUser, resultToken] = await facade.login(
      new LoginRequest("@allen", "password")
    );

    expect(resultUser.alias).toBe("@allen");
    expect(resultToken.token).toBe("token123");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/login"),
      expect.objectContaining({ method: "POST" })
    );

    const options = mockFetch.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(options.body as string)).toMatchObject({
      alias: "@allen",
      password: "password",
    });
  });

  it("register posts to /user/create and returns parsed user and auth token", async () => {
    const user = new User("Allen", "Anderson", "@allen", "image-url");
    const authToken = new AuthToken("token456", 222);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: user,
        authToken: authToken,
      }),
    } as any);

    const facade = new ServerFacade();
    const [resultUser, resultToken] = await facade.register(
      new RegisterRequest(
        "Mark",
        "Brede",
        "@mark",
        "password",
        "abc123",
        "png"
      )
    );

    expect(resultUser.alias).toBe("@allen");
    expect(resultToken.token).toBe("token456");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/create"),
      expect.objectContaining({ method: "POST" })
    );

    const options = mockFetch.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(options.body as string)).toMatchObject({
      firstName: "Mark",
      lastName: "Brede",
      alias: "@mark",
      password: "password",
      imageStringBase64: "abc123",
      imageFileExtension: "png",
    });
  });

  it("getMoreStoryItems posts to /status/story and returns parsed statuses", async () => {
    const user = new User("Allen", "Anderson", "@allen", "image-url");
    const status = new Status("hello world", user, 123);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        items: [status],
        hasMore: false,
      }),
    } as any);

    const facade = new ServerFacade();
    const [items, hasMore] = await facade.getMoreStoryItems({
      authToken: "token123",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    });

    expect(items).toHaveLength(1);
    expect(items[0].post).toBe("hello world");
    expect(hasMore).toBe(false);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/status/story"),
      expect.objectContaining({ method: "POST" })
    );

    const options = mockFetch.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(options.body as string)).toMatchObject({
      authToken: "token123",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    });
  });
});
