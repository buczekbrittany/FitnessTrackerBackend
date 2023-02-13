const express = require('express');
const { getAllActivities, createActivity, getActivityById, getActivityByName, updateActivity } = require('../db');
const { ActivityExistsError } = require('../errors');
const router = express.Router();

router.use((req, res, next)=>{
    next()
})


// GET /api/activities/:activityId/routines


// GET /api/activities
router.get('/', async (req, res) => {
    try {
        const allActivities = await getAllActivities();
        res.send(allActivities)
    } catch (error) {
       throw error
    }
});

// POST /api/activities
router.post('/', async (req, res, next)=> {
    const { name, description } = req.body
    const newActivity = {}
    try {
        newActivity.name = name
        newActivity.description = description
        activity = await createActivity(newActivity)

        if(activity){
            res.send(activity)
        } else {
           next({
                name: 'NewActivityError',
                message: ActivityExistsError(name),
                error: "Activity already exists"
            })
        }
        

    } catch ({name, message}) {
        next({name, message})
    }
})

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
    const id = req.params.activityId
    const { name, description } = req.body
    const activityName = await getActivityByName(name)
    const getActivity = await getActivityById(id)

    try {
        const activityUpdated = await updateActivity({ id, name, description })
        res.send(activityUpdated)
        //this didnt work
        // if(!activityName){
        //     next({
        //         name: 'Already Exists',
        //         message: 'Activity already exists',
        //         error: 'error'
        //     })
        // } else if (getActivity){
        //     next({
        //         name: 'Activity Not Found',
        //         message: 'Activity was not found',
        //         error: 'error'
        //     })
        // } else {
        //     const activityUpdated = await updateActivity({ id, name, description })
        //     res.send(activityUpdated)
        // }
    } catch (error) {
        next(error)
    }
})

module.exports = router;
