const express = require('express');
const app = express.Router()
app.use(express.json())

app.use(require('./auth'));
const {createNewCard} = require('../database/payments/newCards');
const {existingCards} = require('../database/payments/existingCards');
const {userData} = require('../database/user/login');


app.post('/payments/addcard', async (req, res) => {
    
    const iduser = userData.iduser
    if (await existingCards(iduser) > 0) {
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
      await createNewCard(moneda, iban, pin, cardName,  nr_card, cvv, data, iduser)
      
      res.json({success: true});
    }
  });