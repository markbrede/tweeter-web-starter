import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

const mockAuthToken = new AuthToken("abc123", Date.now());
const mockUser = new User("First", "Last", "@user", "imageUrl");

beforeAll(() => {
  (useUserInfo as jest.Mock).mockReturnValue({
    currentUser: mockUser,
    displayedUser: mockUser,
    authToken: mockAuthToken,
  });
});

describe("PostStatus Component", () => {
  it("starts with the post status and clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postStatusButton, clearButton, postField, user } =
      renderPostStatusAndGetElement();

    await user.type(postField, "a");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, postField, user } =
      renderPostStatusAndGetElement();

    await user.type(postField, "a");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postField);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's submitPost method with correct parameters when the post status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const postText = "This is my post";

    const { postStatusButton, postField, user } = renderPostStatusAndGetElement(
      mockPresenterInstance,
    );

    await user.type(postField, postText);
    await user.click(postStatusButton);

    verify(mockPresenter.submitPost(mockAuthToken, postText, mockUser)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  render(!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />);
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", {
    name: /post status/i,
  });
  const clearButton = screen.getByRole("button", { name: /clear/i });
  const postField = screen.getByPlaceholderText(/what's on your mind\?/i);

  return { postStatusButton, clearButton, postField, user };
}
