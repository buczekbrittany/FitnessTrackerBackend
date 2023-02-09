const client = require('./client');
const util = require('./util');
// database functions

async function createActivity({ name, description }) {
  // return the new activity
try {
  const { rows: [ activity ] } = await client.query(`
  INSERT INTO activities ( name, description )
  VALUES ($1,$2)
  ON CONFLICT (name) DO NOTHING
  RETURNING id, name, description;
  `, [ name, description ]);
  return activity;
} catch (error) {
  console.log(error)
  throw error;
}
}

async function getAllActivities() {
  // select and return an array of all activities
  // note: { rows: [activity] } only returns one activity
  // but { rows: activity } returns all activities
  try {
    const { rows: activity } = await client.query(`
    SELECT *
    FROM activities
    `);
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(`
      SELECT *
      FROM activities
      WHERE id=$1;
    `, [id]);
  return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [name]);
  return activity;
  } catch (error) {
    throw error;
  }
}

const attachActivitiesToRoutines = (routines) => {
  const routinesById = {};
  routines.forEach(routine => {
      if(!routinesById[routine.id]) {
          routinesById[routine.id] = {
              id: routine.id,
              creatorName: routine.creatorName,
              creatorId: routine.creatorId,
              isPublic: routine.isPublic,
              name: routine.name,
              goal: routine.goal,
              activities: [],
          };
      }

      const activity = {
          name: routine.activityName,
          id: routine.activityId,
          routineId: routine.id,
          routineActivityId: routine.routineActivityId,
          description: routine.description,
          count: routine.count,
          duration: routine.duration,
      };
      routinesById[routine.id].activities.push(activity)

  });

  return routinesById;
};

async function updateActivity({ id, ...fields }) {
  try {
    const toUpdate ={}
    for (let column in fields){
      if (fields[column] !== undefined ) toUpdate[column] = fields[column]
    }
      let activity;
      if(util.dbFields(toUpdate).insert.length > 0){
        const{ rows } = await client.query(`
        UPDATE activities
        SET ${util.dbFields(toUpdate).insert}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(toUpdate));
        activity = rows[0]
      }
      return activity;
    
  } catch (error) {
    console.log(error)
    throw error
  }





   // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
