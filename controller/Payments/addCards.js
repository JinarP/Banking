const express = require('express');
const app = express.Router()
app.use(express.json())
app.use(require('../user'));
const {createNewCard} = require('../../modal/payments/newCards');
const {existingCards} = require('../../modal/payments/checkCardsExist');
const {userData} = require('../../modal/user/login');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

app.post('/payments/addcard', async (req, res) => {
    let username = localStorage.getItem('data');
    const data = userData(username);
    const iduser = (await data).iduser;
    if (await existingCards(iduser) > 0) {
      const message = 'Card name most be unic';
      res.json({ success: false, message: message });
    } else {
      const cardName = req.body.cardName;
      const coin = req.body.coin;
      const cvv = req.body.cvv;
      const data = req.body.data;
      const iban = req.body.iban;
      const pin = req.body.pin;
      const nr_card = req.body.number;
      await createNewCard(coin, iban, pin, cardName, nr_card, cvv, data, iduser)
      res.json({success: true});
    }
  });

  module.exports = app;