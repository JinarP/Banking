const express = require('express');
const app = express.Router()
const client = require("../dbconection");

async function existingCards (iduser) {
    const clientCards = await client.query('SELECT cardname FROM cards WHERE id_persoana = $1', [iduser])
    return clientCards
}

module.exports = {existingCards}