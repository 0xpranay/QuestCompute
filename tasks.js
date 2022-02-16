const { gql } = require("@apollo/client");
const tasks = [
  {
    id: 0,
    title: "Buy atleast 300 DONUTS on Honeyswap",
    uri: "https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2",
    eligible: gql`
      query (
        $decideAmount: BigInt
        $start: BigInt
        $end: BigInt
        $first: Int
        $skip: Int
      ) {
        backend: swaps(
          where: {
            pair: "0x077240a400b1740c8cd6f73dea37da1f703d8c00"
            amount0Out_gte: $decideAmount
            timestamp_gte: $start
            timestamp_lt: $end
          }
          orderBy: timestamp
          orderDirection: desc
          first: $first
          skip: $skip
        ) {
          to
        }
      }
    `,
    img: "./images/honeyswap.svg",
  },
  {
    id: 1,
    title: "Provide atleast 300 DONUTS liquidity on Honeyswap",
    uri: "https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2",
    eligible: gql`
      query ($decideAmount: BigInt, $first: Int, $skip: Int) {
        backend: liquidityPositions(
          where: {
            pair: "0x077240a400b1740c8cd6f73dea37da1f703d8c00"
            liquidityTokenBalance_gt: $decideAmount
          }
          first: $first
          skip: $skip
          orderBy: liquidityTokenBalance
          orderDirection: desc
        ) {
          user {
            id
          }
        }
      }
    `,
    img: "./images/honeyswap.svg",
  },
  {
    id: 2,
    title: "Deposit atleast 0.01 GNO on Agave.Finance",
    uri: "https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai",
    eligible: gql`
      query ($decideAmount: BigInt, $first: Int, $skip: Int) {
        backend: userReserves(
          where: {
            reserve: "0x9c58bacc331c9aa871afd802db6379a98e80cedb0xa91b9095efa6c0568467562032202108e49c9ef8"
            currentATokenBalance_gt: $decideAmount
          }
          orderBy: currentATokenBalance
          orderDirection: asc
          first: $first
          skip: $skip
        ) {
          user {
            id
          }
        }
      }
    `,
    img: "./images/agave.webp",
  },
  {
    id: 3,
    title: "Borrow atleast 0.01 GNO on Agave.Finance",
    uri: "https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai",
    eligible: gql`
      query ($decideAmount: BigInt, $first: Int, $skip: Int) {
        backend: userReserves(
          where: {
            reserve: "0x9c58bacc331c9aa871afd802db6379a98e80cedb0xa91b9095efa6c0568467562032202108e49c9ef8"
            currentTotalDebt_gt: $decideAmount
          }
          orderBy: currentTotalDebt
          orderDirection: asc
          first: $first
          skip: $skip
        ) {
          user {
            id
          }
        }
      }
    `,
    img: "./images/agave.webp",
  },
];
module.exports = {
  taskList: tasks,
};
