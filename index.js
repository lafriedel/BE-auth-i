const express = require("express");
const knex = require("knex");
const knexConfig = require("./knexfile");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const KnexSessionStore = require('connect-session-knex')(session);
const restrictedRoutes = require("./routes/restrictedRoutes");

const server = express();
const db = knex(knexConfig.development);

const sessionConfig = {
    name: "sesh",
    secret: "innumerable riotous angelic particulars",
    cookie: {
        maxAge: 1000 * 60 * 5,
        secure: false,
    },
    httpOnly: false,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: "sessions",
        sidfieldname: "sid",
        knex: db,
        createtable: true,
        clearInterval: 1000*60*10,
    })
}

server.use(helmet());
server.use(cors({
  credentials: true,
  origin: true
}));
server.use(express.json());
server.use(session(sessionConfig));

server.use("/api/restricted", restricted, restrictedRoutes);

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
            req.session.user = user;
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
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

server.get("/api/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Error logging out.");
      } else {
        res.send("You have logged out.");
      }
    })
  } else {
    res.end();
  }
})

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

    if (req.session && req.session.user) {
              next();
            } else {
              res.status(401).json({ message: "You shall not pass!" });
            }
}

function restricted(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send("Restricted: You must be logged in to access this content.")
  }
}

const port = 8000
server.listen(port, () => console.log(`Server listening on port ${port}`));
