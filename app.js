const express = require('express');
const app = express();
const client = require("./database/dbconection");
const {nana} = require("./helper/login")

app.use(express.json())
app.use(require('./api/auth'));
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));

const port = 3000;
const stripe = require('stripe')('sk_test_51Nw5DuHwuemefw88QbRaIi5bO5GiFWEH3jpIaUDDo6RCyivN6I10gIYSFsAJLM913DKlhzk6XW6tUaZ48u83bsHf00hLucdNy7');

async function  pp(number) {
  const paymentIntent = await stripe.paymentIntents.create({
  amount: parseInt(number),
  currency: 'gbp',
  payment_method: 'pm_card_visa',
});


console.log(paymentIntent.amount);
}

const nr = nana();
console.log(nr)



app.post('/pay', async (req, res) => {
   let value = req.body.value
   pp(value);
});


let username;
let iduser;
let names;
let nr_card;

app.set('view engine', 'jade');


app.get ('/', (req, res) => {
  res.render('login')
})





app.get ('/register', (req, res) => {
  res.render("register")
});

app.get ('/startpage', async (req, res) => {
  const cardname = await client.query('SELECT cardname FROM cards WHERE id_persoana = $1', [iduser]);
  cardname = cardname.rows[0].cardname


  res.render("profile", {username, names, nr_card, cardname});
});

app.get ('/errors', (req, res) => {
  res.render("errormessage" ,{message:"user allready exist"})
});




app.get('/addcard',(req, res) => {
  res.render('newcard');
})

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
    nr_card = req.body.number;
    
    client.query('INSERT INTO cards (moneda, iban, pin, cardname, nr_card, cvv, expdata, id_persoana) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [moneda, iban, pin, cardName,  nr_card, cvv, data, iduser])

    res.json({success: true});
  }
  
});

app.get ('/paylist', (req, res) => {
    res.render("pay")
})

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`);
});