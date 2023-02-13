const express = require('express');
const router = express.Router();
const { JWT_SECRET } = process.env;

// GET /api/health
router.get('/health', async (req, res, next) => {
try {
    res.send({ message: "Look I'm healthy!!"});
} catch (error) {
  res.status(404)
  res.send({ message: "404 error"});
}
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
const { app } = require('faker/lib/locales/en');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
