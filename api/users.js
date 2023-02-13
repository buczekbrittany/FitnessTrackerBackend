/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { UserDoesNotExistError, UserTakenError, PasswordTooShortError } = require('../errors');


const{
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
  } = require('../db');

router.use("/", (req, res, next) => {
    return next();
  });

// POST /api/users/register
router.post('/register', async (req, res, next)=> {
    const { username, password } = req.body;
    try {
      const testUser = await getUserByUsername(username);
    if(testUser){
      next({
          name: 'UserExistsError',
          message: UserTakenError(username),
          error: "error"
      })
        
    } else {

    const user = await createUser({
      username,
      password
    })

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1w',
    })
    res.send({
      message: "Thank you for signing up.",
      token,
      user: user,
    });
    }
    } catch ({ name, message }) {
      next({ name, message })
    }
})

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    console.log(password)
  if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
        } 
    try {
        const user = await getUser(username, password);
        console.log(user)

      if(user && user.password == password) {
        const token = jwt.sign(
           { id: user.id,
            username }, 
            process.env.JWT_SECRET, {
            expiresIn: '1w'
        });
        res.send({ 
        message: "you're logged in!",
        user,
        token });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      next(error);
    }
  });

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
