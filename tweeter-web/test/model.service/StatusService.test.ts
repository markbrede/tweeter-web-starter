import "isomorphic-fetch";
import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

jest.setTimeout(15000);

describe("StatusService integration test", () => {
  it("loadMoreStoryStatuses returns a successful story page", async () => {
    const service = new StatusService();
    const authToken = new AuthToken("token123", Date.now());

    const [items, hasMore] = await service.loadMoreStoryStatuses(
      authToken,
      "@allen",
      10,
      null
    );

    expect(items.length).toBe(10);
    expect(hasMore).toBe(true);
    expect(items[0].user.alias).toBe("@allen");
    expect(items[0].post).toContain("Post 0 0");
  });
});
