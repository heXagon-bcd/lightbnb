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
      console.log("get User with email",result.rows);;
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
  };
  
// const getUserWithEmail = function (email) {
//   let resolvedUser = null;
//   for (const userId in users) {
//     const user = users[userId];
//     if (user?.email.toLowerCase() === email?.toLowerCase()) {
//       resolvedUser = user;
//     }
//   }
//   return Promise.resolve(resolvedUser);
// };

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

// const getUserWithId = function (id) {
//   return Promise.resolve(users[id]);
// };

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

// const addUser = function (user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// };

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {

  const queryString = `
  select p.*, r.*, pr.*, u.* , avg(pr.rating) as avg_rating
  from properties p 
  join reservations r on p.id = r.property_id 
  join property_reviews pr on r.property_id  = pr.property_id
  join users u ON p.owner_id = u.id 
  where u.id = $1
  group by p.id, pr.id, r.id, u.id, p.title, p.cost_per_night , r.start_date 
  order by avg(pr.rating) DESC
  limit $2
`
  return pool
    .query(queryString,[guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);
    })
  
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

  const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  let whereAdded = false;
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
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
    queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100);
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length} `;
    whereAdded = true;
  } 
  if (options.minimum_price_per_night && !options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100)
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `cost_per_night > $${queryParams.length}`;
    whereAdded = true;
  }
  if (!options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100)
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `cost_per_night < $${queryParams.length}`;
    whereAdded = true;
  }

  // Search by minimum rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += whereAdded ? `AND ` : `WHERE `;
    queryString += `property_reviews.rating >= $${queryParams.length} `;
    whereAdded = true;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return result.rows
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
  VALUES (${property.owner_id}, '${property.title}', '${property.description}', '${property.thumbnail_photo_url}', '${property.cover_photo_url}', ${property.cost_per_night}, '${property.street}', '${property.city}', '${property.province}', '${property.post_code}', '${property.country}', '${property.parking_spaces}', '${property.number_of_bathrooms}', '${property.number_of_bedrooms}')
  RETURNING *;
  `
console.log("addProperty", property)
console.log(queryString)

return pool
.query(queryString,)
.then((result) => {
  console.log(result.rows);
  return result.rows
})
.catch((err) => {
  console.log(err.message);
});

};


// const addProperty = function (property) {
//   console.log(property)
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
