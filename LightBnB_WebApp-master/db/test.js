const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'shawnhe',
  password: '',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
const queryString = `
select *
from users
where users.email = $1
`
return pool
  .query(queryString, [email])
  .then( (result) => {
    console.log(result.rows)
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};

console.log(getUserWithEmail('tristanjacobs@gmail.com'))

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  select *
  from users
  where users.id = $1
  `
  return pool
    .query(queryString, [id])
    .then( (result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

console.log(getUserWithId(1))

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (name, email, password) {
const queryString = `
INSERT INTO users (name, email, password)
VALUES($1, $2, $3)
RETURNING *;
`
return pool
.query(queryString, [name, email, password])
.then( (result) => {
  console.log(result.rows);
  return result.rows;
})
.catch((err) => {
  console.log(err.message)
})

};

console.log(addUser('shawn he', 'shawnhe05@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'))

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const queryString = `
select * from properties LIMIT $1;
`
const getAllProperties = (options, limit = 10) => {
  console.log(limit)
  return pool
    .query(queryString, 10)
    .then((result) => {
      console.log(results.rows)
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);
    });
};

console.log(getAllProperties())

// const getAllProperties = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};