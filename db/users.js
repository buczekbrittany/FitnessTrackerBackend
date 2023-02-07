const client = require("./client");
const bcrypt = require('bcrypt');
const { id_ID } = require("faker/lib/locales");
const saltCount = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, saltCount)
  try {
  const { rows: [user] } = await client.query(`
  INSERT INTO users (username,password)
  VALUES ($1,$2)
  ON CONFLICT (username) DO NOTHING
  RETURNING id, username;

  `, [username, hashedPassword]);
  return user;
  
} catch (error) {
  throw error;
}
}

async function getUser({ username, password }) {
// this should be able to verify the password against the hashed password

// if (!username || !password) {
//     return;
//   }
const user = await getUserByUsername(username)
const hashedPassword = user.password;
const isValid = await bcrypt.compare(password, hashedPassword)



try {
  if (isValid) {
    delete user.password
    return user;
  }
  // const { rows: [user] } = await client.query(`
  // SELECT id, username
  // FROM users
  // WHERE password = $1;
  // `, [password]);

  // return user
} catch (error) {
  throw error
}
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * 
    FROM users
    WHERE username= $1;
    `,[userName]);
    
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};