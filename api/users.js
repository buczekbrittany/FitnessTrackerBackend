/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const { createUser, getUserByUsername } = require('../db/users');
router.use("/", (req, res, next) => {
    next();
  });

// POST /api/users/register
router.post('/register', async (req, res, next)=> {
    const { username, password } = req.body;
    try {
        const _user = await getUserByUsername(username);
    if(_user){
        next({
            name: 'UserExistsError',
            message: 'A user by that username already exists.'
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

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
