const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");

async function createNewCard (coin, iban, pin, cardName, nr_card, cvv, data, iduser) {
    client.query('INSERT INTO cards (moneda, iban, pin, cardname, nr_card, cvv, expdata, id_persoana) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [coin, iban, pin, cardName,  nr_card, cvv, data, iduser])
}

module.exports = {createNewCard}