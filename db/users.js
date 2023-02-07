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

const user = await getUserByUsername(username)
const hashedPassword = user.password;
const isValid = await bcrypt.compare(password, hashedPassword)

// NOTES on what's happening here with the code
// using getUserByUsername to select user
// holding onto users password with const hashedPassword
// bcrypt.compare compares password coming through with hashedPassword
//  if(isValid) is boolean, will be either true or false
// if its true, delete password & return user. if not, doesnt run

try {
  if (isValid) {
    delete user.password
    return user;
  }

} catch (error) {
  throw error
}
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=$1;
    `, [userId]);
    delete user.password;
    return user;

  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * 
    FROM users
    WHERE username= $1;
    `, [userName]);
    
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