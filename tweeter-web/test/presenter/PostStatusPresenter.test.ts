import { AuthToken, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusPresenterView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("First", "Last", "@user", "imageUrl");
  const postText = "This is a post";

  beforeEach(() => {
    mockPostStatusPresenterView = mock<PostStatusView>();
    const mockPostStatusPresenterViewInstance = instance(
      mockPostStatusPresenterView,
    );
    when(
      mockPostStatusPresenterView.displayInfoMessage(anything(), 0),
    ).thenReturn("mesageId123");

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusPresenterViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(authToken, postText, currentUser);
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(authToken, postText, currentUser);
    verify(mockService.postStatus(anything(), anything())).once();

    let [capturedAuthToken, capturedStatus] = capture(
      mockService.postStatus,
    ).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(postText);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when posting the status is successful", async () => {
    await postStatusPresenter.submitPost(authToken, postText, currentUser);

    verify(mockPostStatusPresenterView.deleteMessage("mesageId123")).once();
    verify(mockPostStatusPresenterView.clearPost()).once();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).once();

    verify(mockPostStatusPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when posting the status is not successful", async () => {
    let error = new Error("An error occurred");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(authToken, postText, currentUser);
    verify(
      mockPostStatusPresenterView.displayErrorMessage(
        "Failed to post the status because of exception: Error: An error occurred",
      ),
    ).once();

    verify(mockPostStatusPresenterView.deleteMessage("mesageId123")).once();
    verify(mockPostStatusPresenterView.clearPost()).never();
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
