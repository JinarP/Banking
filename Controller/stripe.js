const express = require('express');
const app = express();

app.use(express.json())

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'jade');

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

 module.exports = app;