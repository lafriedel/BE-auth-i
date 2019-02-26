const express = require("express");
const knex = require("knex");
const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);
const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
    res.status(200).send("Confirming access to restricted content.");
})

router.get("/session", (req, res) => {
    db("sessions").select("sid").first()
        .then(sid => {
            if (sid) {
                res.status(200).json(sid);
            } else {
                res.status(404).json({error: "Bad request."})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
})

router.get("/meaning-of-life", (req, res) => {
    res.status(200).json({message: "The meaning of life is 42."})
})