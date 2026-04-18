import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();
  const isAuthenticated = !!currentUser && !!authToken;

  const userItemComponentFactory = (
    item: User,
    featurePath: string,
  ): JSX.Element => {
    return <UserItem user={item} featurePath={featurePath} />;
  };

  const statusItemComponentFactory = (
    item: Status,
    featurePath: string,
  ): JSX.Element => {
    return <StatusItem status={item} featurePath={featurePath} />;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<MainLayout />}>
            <Route
              index
              element={
                <Navigate
                  to={isAuthenticated ? `/feed/${currentUser!.alias}` : "/login"}
                />
              }
            />

            <Route
              path="feed/:displayedUser"
              element={
                isAuthenticated ? (
                  <ItemScroller
                    key="feed-scroller"
                    itemDescription="feed"
                    featurePath="/feed"
                    presenterFactory={(view: PagedItemView<Status>) =>
                      new FeedPresenter(view)
                    }
                    itemComponentFactory={statusItemComponentFactory}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="story/:displayedUser"
              element={
                <ItemScroller
                  key="story-scroller"
                  itemDescription="story"
                  featurePath="/story"
                  presenterFactory={(view: PagedItemView<Status>) =>
                    new StoryPresenter(view)
                  }
                  itemComponentFactory={statusItemComponentFactory}
                />
              }
            />

            <Route
              path="followees/:displayedUser"
              element={
                <ItemScroller
                  key="followees-scroller"
                  itemDescription="followees"
                  featurePath="/followees"
                  presenterFactory={(view: PagedItemView<User>) =>
                    new FolloweePresenter(view)
                  }
                  itemComponentFactory={userItemComponentFactory}
                />
              }
            />

            <Route
              path="followers/:displayedUser"
              element={
                <ItemScroller
                  key="followers-scroller"
                  itemDescription="followers"
                  featurePath="/followers"
                  presenterFactory={(view: PagedItemView<User>) =>
                    new FollowerPresenter(view)
                  }
                  itemComponentFactory={userItemComponentFactory}
                />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated ? `/feed/${currentUser!.alias}` : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
