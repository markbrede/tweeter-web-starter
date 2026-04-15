import "isomorphic-fetch";
import {
  PagedUserItemRequest,
  RegisterRequest,
  UserCountRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../src/model.net/ServerFacade";

jest.setTimeout(15000);

describe("ServerFacade integration tests", () => {
  it("Register returns Allen Anderson and an auth token", async () => {
    const facade = new ServerFacade();

    const [user, authToken] = await facade.register(
      new RegisterRequest(
        "Mark",
        "Brede",
        "@mark",
        "password",
        "abc123",
        "png"
      )
    );

    expect(user.alias).toBe("@allen");
    expect(user.firstName).toBe("Allen");
    expect(user.lastName).toBe("Anderson");
    expect(authToken.token.length).toBeGreaterThan(0);
    expect(authToken.timestamp).toBeGreaterThan(0);
  });

  it("GetFollowers returns a real page of followers", async () => {
    const facade = new ServerFacade();

    const [items, hasMore] = await facade.getMoreFollowers(
      new PagedUserItemRequest("token123", "@allen", 10, null)
    );

    expect(items.length).toBe(10);
    expect(hasMore).toBe(true);
    expect(items[0].alias).toBe("@amy");
    expect(items.every((item) => item.alias !== "@allen")).toBe(true);
  });

  it("GetFollowerCount returns a positive dummy count", async () => {
    const facade = new ServerFacade();

    const count = await facade.getFollowerCount(
      new UserCountRequest("token123", "@allen")
    );

    expect(count).toBeGreaterThan(0);
  });
});
