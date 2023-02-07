const client = require('./db/client');

const getAllRoutines = async () => {
    try {
        await client.connect();
        const { rows } = await client.query(`
            SELECT routines.* count, duration, activities.name as "activityName", activities.id as "activityId", description, username as "creatorName"
            FROM routines
                JOIN routine_activities ON routines.id = routine_activities."routineId"
                JOIN activities ON activities.id = routine_activities."activityId"
                JOIN users ON "creatorId" = users.id
        `);

        let routines = attachActivitiesToRoutines(rows);
        routines = Object.values(routines);
        return routines;

    } catch (error) {
        console.log(error)
    } finally {
        client.end();
    }
};

const attachActivitiesToRoutines = (routines) => {
    const routinesById = {}
    routines.forEach(routine => {
        if(!routinesById[routine.id]) {
            routinesById[routine.id] = {
                id: routine.id,
                creatorId: routine.creatorId,
                name: routine.name,
                goal: routine.goal,
                activities: [],
            };
        }

        const activity = {
            name: routine.activityName,
            id: routine.activityId,
            description: routine.description,
            count: routine.count,
            duration: routine.duration,
        };
        routinesById[routine.id].activities.push(activity)

    });

    return routinesById;
};

getAllRoutines();