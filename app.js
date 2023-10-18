const express = require('express');
const app = express();
app.use(express.json())
app.use(require('./user/auth/auth'));
app.use(require('./payments/stripe/stripe'));
app.use(require('./payments/addcard/addCards'));
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.set('view engine', 'jade');
const {userData} = require('./user/login/login');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

const port = 3000;
app.get ('/', (req, res) => {
  res.render('user/login')
})

app.get ('/user/register', (req, res) => {
  res.render("user/register")
});

app.get ('/user/startpage', async (req, res) => {
  const username = localStorage.getItem('data');
  const data = userData(username);
  const names = (await data).name;
  const nr_card = (await data).nr_card;
  const cardname = (await data).cardname
  res.render("user/profile", {username, names, nr_card, cardname});
});

app.get ('/user/errors', (req, res) => {
  res.render("error/errormessage" ,{message:"user allready exist"})
});

app.get('/payments/addcard',(req, res) => {
  res.render('payments/newcard');
})

app.get ('/payments/onlinepay', (req, res) => {
    res.render("payments/pay")
})

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`);
});