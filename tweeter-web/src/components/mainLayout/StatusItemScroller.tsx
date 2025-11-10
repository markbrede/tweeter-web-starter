import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FakeData, Status } from "tweeter-shared";
import { useParams } from "react-router-dom";
import StatusItem from "../statusItem/StatusItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserInfoActionsHook, UserInfoHook } from "../userInfo/UserInfoHooks";
import { StatusItemView, StatusItemPresenter } from "../../presenter/StatusItemPresenter";


interface Props {
  itemDescription: string;
  featureUrl: string;
  presenterFactory: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);

  const { displayedUser, authToken } = UserInfoHook();
  const { setDisplayedUser } = UserInfoActionsHook();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // View object passed to the presenter (same idea as UserItemScroller)
  const view: StatusItemView = {
    addItems: (newItems: Status[]) =>
      setItems((prev) => [...prev, ...newItems]),
    displayErrorMessage,
  };

const presenterRef = useRef<StatusItemPresenter | null>(null);
if (!presenterRef.current) {
  presenterRef.current = props.presenterFactory(view);
}

  // Normalize the route base to always have a leading slash for absolute navigation
  const featurePath = props.featureUrl.startsWith("/")
    ? props.featureUrl
    : `/${props.featureUrl}`;

  // Sync displayedUser with :displayedUser in the URL (same pattern you used)
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser!.alias
    ) {
      // TODO: Replace with server call later
      const toUser = FakeData.instance.findUserByAlias(displayedUserAliasParam!);
      if (toUser) setDisplayedUser(toUser);
    }
  }, [displayedUserAliasParam]);

  // Re-init when displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = () => {
    setItems([]);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    await presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <StatusItem key={index} status={item} featurePath={featurePath} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
