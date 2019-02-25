const express = require("express");
const knex = require("knex");
const knexConfig = require("./knexfile");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcrypt");

const server = express();
const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.post("/api/register", (req, res) => {
  let newUser = req.body;

  if (newUser) {
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;

    db("users")
      .insert(newUser)
      .then(newId => {
        const [id] = newId;
        db("users")
          .where("id", id)
          .first()
          .then(newUser => {
            res.status(201).json(newUser);
          });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res
      .status(404)
      .json({ error: "You must provide both a username and password." });
  }
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;

  if (username && password) {
    db("users")
      .where("username", username)
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: "Invalid credentials." });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "There was an error." });
      });
  } else {
    res
      .status(400)
      .json({ error: "You must provide both a username and password." });
  }
});

server.get("/api/users", authorize, (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error." });
    });
});

function authorize(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        db("users")
          .where("username", username)
          .first()
          .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
              next();
            } else {
              res.status(401).json({ message: "Invalid credentials." });
            }
          })
          .catch(err => {
            res.status(500).json({ error: "There was an error." });
          });
      } else {
        res
          .status(400)
          .json({ error: "You must provide both a username and password." });
      }
}

server.listen(8000, () => console.log("Server listening on port 8000"));
