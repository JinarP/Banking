const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");

async function createAcount (newuser, password, email, names) {
    client.query('INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)', [newuser, password, email, names])
    iduser = await client.query('SELECT id FROM users WHERE username = $1', [newuser]);
}

module.exports = {createAcount};