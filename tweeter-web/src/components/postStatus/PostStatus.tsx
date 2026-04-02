import "./PostStatus.css";
import { useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHook";
import {
  PostStatusView,
  PostStatusPresenter,
} from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    displayErrorMessage,
    displayInfoMessage,
    deleteMessage,
    setIsLoading: setIsLoading,
    clearPost: () => setPost(""),
  };

  const presenterRef = useRef<PostStatusPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new PostStatusPresenter(listener);
  }

  const submitPost = (event: React.MouseEvent) => {
    event.preventDefault();
    presenterRef.current!.submitPost(authToken!, post, currentUser!);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus = () => {
    return presenterRef.current!.isPostDisabled(post, authToken, currentUser!);
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
