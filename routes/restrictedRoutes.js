const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);
const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
    res.status(200).send("Confirming access to restricted content.");
})

router.get("/meaning-of-life", (req, res) => {
    res.status(200).json({message: "The meaning of life is 42."})
})