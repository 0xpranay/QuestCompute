const { ethers } = require("ethers");
const whitelist = require("./whitelist.json");
function cleanUsers(users, id, cleaned) {
  const uncleaned = users;
  for (let i = 0; i < uncleaned.data.backend.length; i++) {
    let rawObject = uncleaned.data.backend[i];
    let rawAddress = "";
    switch (id) {
      case 0:
        rawAddress = rawObject.to;
        break;
      case 1:
        rawAddress = rawObject.user.id;
        break;
      case 2:
        rawAddress = rawObject.user.id;
        break;
      case 3:
        rawAddress = rawObject.user.id;
        break;
    }
    const cleanAddress = ethers.utils.getAddress(rawAddress);
    if (whitelist.includes(rawAddress) || whitelist.includes(cleanAddress)) {
      if (!cleaned.users.includes(cleanAddress)) {
        cleaned.users.push(cleanAddress);
        console.log(`${rawAddress} is in whitelist`);
      }
    }
  }
  return cleaned;
}

module.exports = {
  cleanUsers: cleanUsers,
};
