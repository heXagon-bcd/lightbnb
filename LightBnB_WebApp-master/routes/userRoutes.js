const express = require("express");
const bcrypt = require("bcrypt");
const database = require("../db/database");

const router = express.Router();

// Create a new user
router.post("/", (req, res) => {
  const user = req.body;
  console.log("req body user email",req.body.email);
  user.password = bcrypt.hashSync(user.password, 12);
  database
   .addUser(user.name, user.email, user.password)//need to accesss object
    // .addUser('test2', 'test2@gmail.com', 'test')
    .then((user) => {
      if (!user) {
        return res.send({ error: "error" });
      }

      req.session.userId = user.id;
      res.send("🤗");
    })
    .catch((e) => res.send(e));
});

// Log a user in
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("test", email, password)

  database.getUserWithEmail(email).then((user) => {
    console.log("user",user)
    if (!user) {
      return res.send({ error: "no user with that id" });
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
      return res.send({ error: "error" });
    }
    
    req.session.userId = user[0].id;
   
    res.send({
      user: {
        name: user[0].name,
        email: user[0].email,
        id: user[0].id,
      },
    });
  });
});

// Log a user out
router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.send({});
});

// Return information about the current user (based on cookie value)
router.get("/me", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ message: "not logged in" });
  }

  database
    .getUserWithId(userId)
    .then((user) => {
      if (!user) {
        return res.send({ error: "no user with that id" });
      }

      res.send({
        user: {
          name: user.name,
          email: user.email,
          id: userId,
        },
      });
    })
    .catch((e) => res.send(e));
});

module.exports = router;
