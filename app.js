const express = require('express');
const app = express();
const client = require("./database/dbconection");

app.use(express.json())
app.use(require('./api/auth'));
app.use(require('./api/stripe'));
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.set('view engine', 'jade');

const port = 3000;

app.get ('/', (req, res) => {
  res.render('login')
})

app.get ('/register', (req, res) => {
  res.render("register")
});

app.get ('/user/startpage', async (req, res) => {
  const cardname = await client.query('SELECT cardname FROM cards WHERE id_persoana = $1', [iduser]);
  cardname = cardname.rows[0].cardname
  res.render("profile", {username, names, nr_card, cardname});
});

app.get ('/user/errors', (req, res) => {
  res.render("errormessage" ,{message:"user allready exist"})
});

app.get('/payments/addcard',(req, res) => {
  res.render('newcard');
})

app.get ('/payments/onlinepay', (req, res) => {
    res.render("pay")
})

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`);
});