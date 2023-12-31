const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "shawnhe",
  password: "",
  host: "localhost",
  database: "lightbnb",
});

///Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function (email) {
  const queryString = `
  SELECT *
  FROM users
  WHERE users.email = $1
  `;
  return pool
    .query(queryString, [email])
    .then((result) => {
      console.log("get User with email", result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  SELECT *
  FROM users
  WHERE users.id = $1;
  `;
  return pool
    .query(queryString, [id])
    .then((result) => {
      console.log(result.rows);
      return result.rows;//sent back object, sql will return back an array
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function (name, email, password) {
  //how does it know to turn $1 into a string
  console.log("adduser", name, email, password);
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING*;
  `;
  return pool
    .query(queryString, [name, email, password])
    .then((result) => {
      console.log("add user results",result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT p.*, r.*, pr.*, u.* , avg(pr.rating) as average_rating
  FROM properties p 
  JOIN reservations r ON p.id = r.property_id 
  JOIN property_reviews pr ON r.property_id  = pr.property_id
  JOIN users u ON p.owner_id = u.id 
  WHERE u.id = $1
  GROUP BY p.id, pr.id, r.id, u.id, p.title, p.cost_per_night , r.start_date 
  ORDER BY avg(pr.rating) DESC
  LIMIT $2
`;
  return pool
    .query(queryString, [guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let whereAdded = false;

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // search by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    whereAdded = true;
  }

  //search by onwer
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `owner_id = $${queryParams.length} `;
    whereAdded = true;
  }

  // Search by min and max price
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(
      options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100
    );
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `cost_per_night BETWEEN $${queryParams.length - 1} AND $${
      queryParams.length
    } `;
    whereAdded = true;
  }
  if (options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `cost_per_night > $${queryParams.length}`;
    whereAdded = true;
  }
  if (!options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `cost_per_night < $${queryParams.length}`;
    whereAdded = true;
  }

  // group by
  queryString += `GROUP BY properties.id`;

  // Search by minimum rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += whereAdded ? `AND ` : ` HAVING `;
    queryString += `avg(property_reviews.rating) >= $${queryParams.length}`
    whereAdded = true;
  }

  //add limit
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `
  
  console.log("queryparams", queryParams)
  console.log("queryString", queryString)
  // Pool
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      // console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

const addProperty = function (property) {
  queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
  VALUES (${property.owner_id}, '${property.title}', '${property.description}', '${property.thumbnail_photo_url}', '${property.cover_photo_url}', ${property.cost_per_night * 100}, '${property.street}', '${property.city}', '${property.province}', '${property.post_code}', '${property.country}', '${property.parking_spaces}', '${property.number_of_bathrooms}', '${property.number_of_bedrooms}')
  RETURNING *;
  `;

  return pool
    .query(queryString)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
