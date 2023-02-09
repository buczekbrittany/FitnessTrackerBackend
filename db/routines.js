const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
const util = require("./util");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routines ( "creatorId", "isPublic", name, goal)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
  
    `, [creatorId, isPublic, name, goal ]);
    return routine;
    
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [ routine ] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id=$1;
    `,[id]);
    return routine;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
// select and return an array of all routines
try {
  const { rows: routine } = await client.query(`
  SELECT *
  FROM routines
  `);
  return routine;
} catch (error) {
  console.log(error)
  throw error;
}
}

 async function getAllRoutines () {
  try {
      const { rows } = await client.query(`
          SELECT routines.*, count, duration, activities.name as "activityName", routine_activities.id as "routineActivityId", activities.id as "activityId", description, username as "creatorName"
          FROM routines
              JOIN routine_activities ON routines.id = routine_activities."routineId"
              JOIN activities ON activities.id = routine_activities."activityId"
              JOIN users ON "creatorId" = users.id
      `); 
      // console.log(rows)
      let routines = attachActivitiesToRoutines(rows);
      routines = Object.values(routines);
      return routines;

  } catch (error) {
      console.log(error)
  }
 };


async function getAllPublicRoutines() {
  try {
    let routines = await getAllRoutines();

    routines = routines.filter(routine => {
      // returning any routine that has .isPublic
      return routine.isPublic
    });

    return routines;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    let routines = await getAllRoutines();

    routines = routines.filter(routine => {
      return routine.creatorName
    })
    return routines;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    let routines = await getAllPublicRoutines();

    routines = routines.filter(routine => {
      return routine.creatorName
    })
    return routines;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    let routines = await getAllPublicRoutines();
 
    routines = routines.filter(routine => {
      let foundActivity = false
      for(let i = 0; i < routine.activities.length;i++){
  if(routine.activities[i].id === id){
     foundActivity = true
  }
      }
      return foundActivity
    })
    return routines
  } catch (error) {
    console.log(error)
    throw (error)
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const toUpdate ={}
    for (let column in fields){
      if (fields[column] !== undefined ) toUpdate[column] = fields[column]
    }
      let routine;
      if(util.dbFields(toUpdate).insert.length > 0){
        const{ rows } = await client.query(`
        UPDATE routines
        SET ${util.dbFields(toUpdate).insert}
        WHERE id=${id}
        RETURNING *;
        `, Object.values(toUpdate));
        routine = rows[0]
      }
      return routine;
    
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function destroyRoutine(id) {
  try {
    const {rows:}
    await client.query(`
      DELETE FROM routine_activities
      WHERE id=$1
      `, [id])
  } catch (error) {
    console.log(error)
    throw error
  }

}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
