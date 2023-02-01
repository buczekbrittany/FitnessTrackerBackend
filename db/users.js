const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  const saltCount = 10;
  const hashedPassword = await bcrypt.hash(password, saltCount)
  
}

async function getUser({ username, password }) {
  const user = await getUserByUserName(username);
  const hashedPassword = user.password;
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}