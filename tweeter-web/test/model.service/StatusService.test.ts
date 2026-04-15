import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "../../src/model.net/ServerFacade";
import { StatusService } from "../../src/model.service/StatusService";

describe("StatusService", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("loadMoreStoryStatuses delegates to ServerFacade with the correct request values", async () => {
    const authToken = new AuthToken("token123", 111);
    const user = new User("Allen", "Anderson", "@allen", "image-url");
    const status = new Status("story post", user, 123);

    const facadeSpy = jest
      .spyOn(ServerFacade.prototype, "getMoreStoryItems")
      .mockResolvedValue([[status], false]);

    const service = new StatusService();
    const [items, hasMore] = await service.loadMoreStoryStatuses(
      authToken,
      "@allen",
      10,
      null
    );

    expect(items).toHaveLength(1);
    expect(items[0].post).toBe("story post");
    expect(hasMore).toBe(false);

    const request = facadeSpy.mock.calls[0][0];
    expect(request.authToken).toBe("token123");
    expect(request.userAlias).toBe("@allen");
    expect(request.pageSize).toBe(10);
    expect(request.lastItem).toBeNull();
  });
});
