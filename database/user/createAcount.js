const express = require('express');
const app = express.Router()
const client = require("../dbconection");

async function createacount (newuser, password, email, names) {
    client.query('INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)', [newuser, password, email, names])
    iduser = await client.query('SELECT id FROM users WHERE username = $1', [newuser]);
}

module.exports = {createacount};