const {
    ApolloClient,
    gql,
    InMemoryCache,
    createHttpLink,
} = require("@apollo/client");
const {writeFile} = require("fs");
const chalk = require("chalk");
const {ethers} = require("ethers");
const {taskList} = require("./tasks");
require("cross-fetch/polyfill");
const moment = require("moment");
const {cleanUsers} = require("./cleanUsers");
console.clear();
BigInt.prototype.toJSON = function () {
    return this.toString();
};
async function fetchUsers(id, query, params, client) {
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
        console.log(
            chalk.black.bgYellow(
                `------------------------ Fetching for task ${i} --------------------------------`
            )
        );
        const task = taskList[i];
        const id = task.id;
        const query = task.eligible;
        const uri = task.uri;
        let checkSumUsers = {
            users: [],
        };
        let users = {
            data: {
                backend: [],
            },
        };
        let pagination = 1;
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
        do {
            switch (id) {
                case 0:
                    params = {
                        decideAmount: 300,
                        start: monthBackTimestamp,
                        end: currentTimestamp,
                        first: 1000,
                        skip: (pagination - 1) * 1000,
                    };
                    break;
                case 1:
                    params = {
                        decideAmount: 0,
                        first: 1000,
                        skip: (pagination - 1) * 1000,
                    };
                    break;
                case 2:
                    params = {
                        decideAmount: ethers.utils
                            .parseEther("0.01")
                            .toBigInt(),
                        first: 1000,
                        skip: (pagination - 1) * 1000,
                    };
                    break;
                case 3:
                    params = {
                        decideAmount: ethers.utils
                            .parseEther("0.01")
                            .toBigInt(),
                        first: 1000,
                        skip: (pagination - 1) * 1000,
                    };
                    break;
            }
            users = await fetchUsers(id, query, params, client);
            checkSumUsers = cleanUsers(users, id, checkSumUsers);
            console.log(
                "Users detected ",
                chalk.black.bgGreenBright(checkSumUsers.users.length)
            );
            if (users.data.backend.length >= 1000) {
                console.log(
                    chalk.black.bgCyan(
                        ">1000 addresses detected. Fetching again"
                    )
                );
            }
            pagination += 1;
        } while (users.data.backend.length >= 1000);
        writeFile(
            `./${i}.json`,
            JSON.stringify(checkSumUsers, null, 2),
            (error) => {
                if (error) {
                    console.log("An error has occurred ", error);
                    return;
                }
                console.log(
                    chalk.greenBright(
                        `Task ${i} data written successfully to disk`
                    )
                );
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
