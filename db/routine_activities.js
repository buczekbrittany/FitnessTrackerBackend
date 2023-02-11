const client = require("./client");
const { getRoutineById } = require("./routines");
const util = require("./util");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [ routine ],} = await client.query(
      ` INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;`,
      [routineId, activityId, count, duration]
      );
     return routine; 
    }
    catch (error) {
      throw error;
    }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [ routineActivities ] } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `, [id]);
    return routineActivities;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivities } = await client.query(
    `SELECT *
    FROM routine_activities
    WHERE "routineId"=$1
    `, [id]);
  return routineActivities
  } catch (error) {
    throw error
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const toUpdate ={}
    for (let column in fields){
      if (fields[column] !== undefined ) toUpdate[column] = fields[column]
    }
      let routineActivity;
      if(util.dbFields(toUpdate).insert.length > 0){
        const{ rows } = await client.query(`
        UPDATE routine_activities
        SET ${util.dbFields(toUpdate).insert}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(toUpdate));
        routineActivity = rows[0]
      }
      return routineActivity;
    
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [ destroyedRoutineActivity ] } =  await client.query(`
      DELETE FROM routine_activities
      WHERE "activityId"=$1
      RETURNING *
      ;`, [id])
    return destroyedRoutineActivity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const editedRoutine = await getRoutineActivityById(routineActivityId)
  const userRoutineId = await getRoutineById(userId)

  try {
    if (!userRoutineId) {
      return false
    } if (editedRoutine.routineId === userRoutineId.creatorId) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error);
    throw error;
  } 
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
