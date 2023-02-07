const client = require('./client');

// database functions

async function createActivity({ name, description }) {
  // return the new activity
try {
  const { rows: [ activity ] } = await client.query(`
  INSERT INTO activities ( name, description )
  VALUES ($1,$2)
  ON CONFLICT (name) DO NOTHING
  RETURNING name, description;
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

async function getActivityById(id) {}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
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
