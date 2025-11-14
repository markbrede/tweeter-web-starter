/*
  Non ui logic originally inside UserInfoComponent:
  - determining follower status (currentUser vs displayedUser)
  - loading follower / followee counts
  - coordinating follow / unfollow actions
  - showing toasts + handling loading / error states
  - navigation back to the logged-in user
  
  MVP flow after refactor:
  - UserInfoComponent.tsx (ui only)
      -> holds React state, renders UI, forwards events to presenter
  - UserInfoPresenter
      -> runs all logic: follower checks, count loading, follow/unfollow,
         toast handling, loading/error state updates, navigation decisions
  - FollowService
      -> single place for FakeData / server calls for all follow related operations
  - UserInfoView interface (implemented by the component)
      -> presenter drives UI updates strictly through this interface
*/


import "./UserInfoComponent.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserInfoActionsHook, UserInfoHook } from "./UserInfoHooks";
import { UserInfoPresenter } from "../../presenter/UserInfoPresenter";


const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken, displayedUser } = UserInfoHook();
  const { setDisplayedUser } = UserInfoActionsHook();
  const navigate = useNavigate();
  const location = useLocation();

  const presenter = new UserInfoPresenter({
  // State setters
  setIsFollower: setIsFollower,
  setFollowerCount: setFollowerCount,
  setFolloweeCount: setFolloweeCount,
  setIsLoading: setIsLoading,
  setDisplayedUser: setDisplayedUser,


  // Messaging
  displayInfoMessage: displayInfoMessage,
  displayErrorMessage: displayErrorMessage,
  deleteMessage: deleteMessage,

  // Navigation
    navigateToUser: (alias: string) => {
    const segments = location.pathname.split("/@");
    const baseUrl = segments.length > 1 ? segments[0] : "/";
    navigate(`${baseUrl}/${alias}`);
  },

  // Accessors
  getCurrentUser: () => currentUser,
  getDisplayedUser: () => displayedUser,
  getAuthToken: () => authToken,
});

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    presenter.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    presenter.setNumbFollowees(authToken!, displayedUser!);
    presenter.setNumbFollowers(authToken!, displayedUser!);
  }, [authToken, currentUser, displayedUser, presenter]);

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
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
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={(e) => { e.preventDefault(); presenter.onReturnToLoggedInUserClicked(); }}
                  >
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
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(e) => { e.preventDefault(); presenter.onUnfollowClicked(); }}
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
                      onClick={(e) => { e.preventDefault(); presenter.onFollowClicked(); }}
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
      )}
    </>
  );
};

export default UserInfo;
