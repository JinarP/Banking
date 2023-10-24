const express = require('express');
const app = express.Router()
app.use(express.json())
const {createNewCard} = require('../model/payments');
const {existingCards} = require('../model/payments');
const {userData} = require('../model/user');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const stripe = require('stripe')('sk_test_51Nw5DuHwuemefw88QbRaIi5bO5GiFWEH3jpIaUDDo6RCyivN6I10gIYSFsAJLM913DKlhzk6XW6tUaZ48u83bsHf00hLucdNy7');

async function  makePay(number) {
    await stripe.paymentIntents.create({
    amount: parseInt(number),
    currency: 'gbp',
    payment_method: 'pm_card_visa',
  });
  }
  
  app.post('/pay', async (req, res) => {
     let value = req.body.value
     makePay(value);
     res.render('newcard')
  });

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

  app.get('/payments/addcard',(req, res) => {
    res.render('payments/newcard');
  })
  
  app.get ('/payments/onlinepay', (req, res) => {
      res.render("payments/pay")
  })

  module.exports = app;