const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { readFileSync, writeFile } = require("fs");
const { ethers } = require("ethers");
const { taskList } = require("./tasks");
require("cross-fetch/polyfill");
console.clear();
async function main() {
  let taskRoots = {
    taskRoots: [],
  };
  for (let i = 0; i < taskList.length; i++) {
    const userData = readFileSync(`./${i}.json`);
    const userJson = JSON.parse(userData);
    const usersArray = userJson.users;
    const merkleTree = new MerkleTree(
      usersArray.map((x) => keccak256(x)),
      keccak256,
      {
        sortPairs: true,
      }
    );
    console.log(i, merkleTree.getHexRoot());
    taskRoots.taskRoots.push({ [i]: merkleTree.getHexRoot() });
  }
  writeFile(`./roots.json`, JSON.stringify(taskRoots, null, 2), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
    console.log("Roots written successfully to disk");
  });
}
main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
