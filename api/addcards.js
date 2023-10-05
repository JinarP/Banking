const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");
app.use(require('./auth'));

app.post('/addcard', async (req, res) => {
    const clientCards = await client.query('SELECT cardname FROM cards WHERE id_persoana = $1', [iduser])
    if (clientCards.rowCount > 0) {
      const message = 'Card name most be unic';
      res.json({ success: false, message: message });
    } else {
      const cardName = req.body.cardName;
      const moneda = req.body.moneda;
      const cvv = req.body.cvv;
      const data = req.body.data;
      const iban = req.body.iban;
      const pin = req.body.pin;
      const nr_card = req.body.number;
      
      client.query('INSERT INTO cards (moneda, iban, pin, cardname, nr_card, cvv, expdata, id_persoana) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [moneda, iban, pin, cardName,  nr_card, cvv, data, iduser])
  
      res.json({success: true});
    }
  });