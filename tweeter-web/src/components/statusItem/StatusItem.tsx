import { Link } from "react-router-dom";
import { Status } from "tweeter-shared";
import Post from "../statusItem/Post";
import { UseUserNavigationHook } from "../Hooks/UserNavigationHook";
import { UserInfoHook } from "../userInfo/UserInfoHooks";


interface StatusItemProps {
  status: Status;
  // For FeedScroller.tsx or StoryScroller.tsx
  featurePath: string;
}

const StatusItem = ({ status, featurePath }: StatusItemProps) => {
  const { goToUser } = UseUserNavigationHook();
  const { authToken } = UserInfoHook();


  return (
    <div className="row mb-3 mx-0 px-0 border rounded bg-white">
      <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={status.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {status.user.firstName} {status.user.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={`${featurePath}/${status.user.alias.startsWith("@") ? status.user.alias.substring(1) : status.user.alias }`}
                  onClick={(e) => { e.preventDefault(); goToUser(authToken!, status.user.alias); }}
                >
                  {status.user.alias}
                </Link>
              </h2>
              {status.formattedDate}
              <br />
              <Post status={status} featurePath={featurePath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
