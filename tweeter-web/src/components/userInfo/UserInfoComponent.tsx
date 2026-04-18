import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "./UserInfoHook";
import { useUserInfoActions } from "./UserInfoActionsHook";
import {
  UserInfoView,
  UserInfoPresenter,
} from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  const listener: UserInfoView = {
    setIsFollower,
    setFollowerCount,
    setFolloweeCount,
    setIsLoading,
    displayErrorMessage,
    displayInfoMessage,
    deleteMessage,
  };

  const presenterRef = useRef<UserInfoPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoPresenter(listener);
  }

  useEffect(() => {
    if (!displayedUser && currentUser) {
      setDisplayedUser(currentUser);
    }
  }, [displayedUser, currentUser, setDisplayedUser]);

  useEffect(() => {
    setIsFollower(false);
    setFolloweeCount(-1);
    setFollowerCount(-1);

    if (!displayedUser) {
      return;
    }

    const requestAuthToken = authToken ?? new AuthToken("", 0);
    const viewingUser = currentUser ?? displayedUser;

    presenterRef.current!.loadUserInfo(
      requestAuthToken,
      viewingUser,
      displayedUser,
    );
  }, [displayedUser, currentUser, authToken]);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    navigate(`${getBaseUrl()}/${currentUser!.alias}`);
  };

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  const followDisplayedUser = (event: React.MouseEvent) => {
    event.preventDefault();
    presenterRef.current!.followUser(authToken!, displayedUser!);
  };

  const unfollowDisplayedUser = (event: React.MouseEvent) => {
    event.preventDefault();
    presenterRef.current!.unfollowUser(authToken!, displayedUser!);
  };

  if (displayedUser === null) {
    return <></>;
  }

  const canFollow =
    currentUser !== null &&
    authToken !== null &&
    !displayedUser.equals(currentUser);

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto p-3">
          <img
            src={displayedUser.imageUrl}
            className="img-fluid"
            width="100"
            alt="Posting user"
          />
        </div>
        <div className="col p-3">
          {canFollow && (
            <p id="returnToLoggedInUser">
              Return to{" "}
              <Link to={`./${currentUser!.alias}`} onClick={switchToLoggedInUser}>
                logged in user
              </Link>
            </p>
          )}
          <h2>
            <b>{displayedUser.name}</b>
          </h2>
          <h3>{displayedUser.alias}</h3>
          <br />
          {followeeCount > -1 && followerCount > -1 && (
            <div>
              Followees: {followeeCount} Followers: {followerCount}
            </div>
          )}
        </div>
        <form>
          {canFollow && (
            <div className="form-group">
              {isFollower ? (
                <button
                  id="unFollowButton"
                  className="btn btn-md btn-secondary me-1"
                  type="submit"
                  style={{ width: "6em" }}
                  onClick={unfollowDisplayedUser}
                >
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <div>Unfollow</div>
                  )}
                </button>
              ) : (
                <button
                  id="followButton"
                  className="btn btn-md btn-primary me-1"
                  type="submit"
                  style={{ width: "6em" }}
                  onClick={followDisplayedUser}
                >
                  {isLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <div>Follow</div>
                  )}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
