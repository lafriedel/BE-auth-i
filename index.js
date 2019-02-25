const express = require("express");
const knex = require("knex");
const knexConfig = require('./knexfile');
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcrypt");

const server = express();
const db = knex(knexConfig.development);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.listen(8000, () => console.log("Server listening on port 8000"));