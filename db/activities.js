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

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

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
