import { User } from "tweeter-shared";
import { FillFollowTableDao } from "./FillFollowTableDao";
import { FillUserTableDao } from "./FillUserTableDao";

const targetFolloweeAlias = "@jane";
const baseFollowerAlias = "@batchfollower";
const followerPassword = "password";
const followerImageUrl =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const baseFollowerFirstName = "Batch";
const baseFollowerLastName = "Follower";

const numberUsersToCreate = 10000;
const batchSize = 25;

const fillUserTableDao = new FillUserTableDao();
const fillFollowTableDao = new FillFollowTableDao();

main();

async function main() {
  const followee = await fillUserTableDao.getUser(targetFolloweeAlias);

  if (!followee) {
    throw new Error(`Target followee ${targetFolloweeAlias} was not found`);
  }

  for (let start = 1; start <= numberUsersToCreate; start += batchSize) {
    const users = createUserList(start, Math.min(start + batchSize - 1, numberUsersToCreate));

    await fillUserTableDao.createUsers(users, followerPassword);
    await fillFollowTableDao.createFollows(followee, users);

    const createdCount = Math.min(start + batchSize - 1, numberUsersToCreate);
    if (createdCount % 1000 === 0 || createdCount === numberUsersToCreate) {
      console.log(`Created ${createdCount} users and follows`);
    }
  }

  console.log("Done!");
}

function createUserList(start: number, end: number): User[] {
  const users: User[] = [];

  for (let i = start; i <= end; i++) {
    users.push(
      new User(
        `${baseFollowerFirstName}${i}`,
        `${baseFollowerLastName}${i}`,
        `${baseFollowerAlias}${i}`,
        followerImageUrl
      )
    );
  }

  return users;
}
