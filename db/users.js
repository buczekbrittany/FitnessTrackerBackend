const client = require("./client");
const bcrypt = require('bcrypt');
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
  if (!username || !password) {
    return;
  }
  try {
    // need to add stuff here
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
 
}

async function getUserByUsername(username) {
  try {
    const { rows: [username] } = await client.query(`
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