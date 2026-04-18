import "isomorphic-fetch";
import {
  LoginRequest,
  RegisterRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../src/model.net/ServerFacade";
import { StatusService } from "../../src/model.service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  instance,
  mock,
  verify,
  when,
} from "@typestrong/ts-mockito";

jest.setTimeout(30000);

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X2WQAAAAASUVORK5CYII=";

describe("PostStatus integration", () => {
  it("appends a newly posted status to the user's story", async () => {
    const facade = new ServerFacade();
    const statusService = new StatusService();

    const unique = Date.now();
    const alias = `@it${unique}`;
    const password = "password";

    await facade.register(
      new RegisterRequest(
        "Integration",
        "Tester",
        alias,
        password,
        TINY_PNG_BASE64,
        "png"
      )
    );

    const [loggedInUser, authToken] = await facade.login(
      new LoginRequest(alias, password)
    );

    const mockView = mock<PostStatusView>();
    when(mockView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

    const presenter = new PostStatusPresenter(instance(mockView));

    const postText = `Integration post ${unique}`;

    await presenter.submitPost(authToken, postText, loggedInUser);

    verify(
      mockView.displayInfoMessage("Successfully Posted!", 2000)
    ).once();

    const [items] = await statusService.loadMoreStoryStatuses(
      authToken,
      loggedInUser.alias,
      10,
      null
    );

    expect(items.length).toBeGreaterThan(0);
    expect(items[0].post).toBe(postText);
    expect(items[0].user.alias).toBe(loggedInUser.alias);
    expect(items[0].user.firstName).toBe(loggedInUser.firstName);
    expect(items[0].user.lastName).toBe(loggedInUser.lastName);
    expect(items[0].user.imageUrl).toBe(loggedInUser.imageUrl);
  });
});
