const {
  ApolloClient,
  gql,
  InMemoryCache,
  createHttpLink,
} = require("@apollo/client");
const { writeFile } = require("fs");
const { ethers } = require("ethers");
const { taskList } = require("./tasks");
require("cross-fetch/polyfill");
const moment = require("moment");
const { cleanUsers } = require("./cleanUsers");

BigInt.prototype.toJSON = function () {
  return this.toString();
};
async function fetchUsers(id, query, params, client) {
  console.log(`Fetching for task ${id}`);
  console.log("With params ", params);
  const result = await client.query({
    query: query,
    variables: params,
  });
  return result;
}

async function main() {
  let params = {};
  for (let i = 0; i < taskList.length; i++) {
    const task = taskList[i];
    const id = task.id;
    const query = task.eligible;
    const uri = task.uri;
    const link = createHttpLink({
      uri: uri,
    });
    const client = new ApolloClient({
      cache: new InMemoryCache({
        addTypename: false,
      }),
      link: link,
    });
    const currentTimestamp = moment().unix();
    const monthBackTimestamp = moment().subtract(1, "month").unix();
    switch (id) {
      case 0:
        params = {
          decideAmount: 300,
          start: monthBackTimestamp,
          end: currentTimestamp,
          first: 1000,
          skip: 0,
        };
        break;
      case 1:
        params = {
          decideAmount: 0,
          first: 1000,
          skip: 0,
        };
        break;
      case 2:
        params = {
          decideAmount: ethers.utils.parseEther("0.01").toBigInt(),
          first: 1000,
          skip: 0,
        };
        break;
      case 3:
        params = {
          decideAmount: ethers.utils.parseEther("0.01").toBigInt(),
          first: 1000,
          skip: 0,
        };
        break;
    }
    const users = await fetchUsers(id, query, params, client);
    console.log("task ", id, " No of users is ", users.data.backend.length);
    const checkSumUsers = cleanUsers(users, id);
    writeFile(
      `./${i}.json`,
      JSON.stringify(checkSumUsers, null, 2),
      (error) => {
        if (error) {
          console.log("An error has occurred ", error);
          return;
        }
        console.log("Data written successfully to disk");
      }
    );
  }
  return;
}
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
main();
