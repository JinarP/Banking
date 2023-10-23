const express = require('express');
const routs = express();
routs.use(express.json())
routs.use(require('../controller/user'));
routs.use(require('../controller/Payments/stripe'));
routs.use(require('../controller/Payments/addCards'));
let path = require("path");
routs.use(express.urlencoded({ extended: true }));
routs.use(express.static(path.join(__dirname, 'public')));
routs.use(express.static(__dirname + '/public'));
routs.use(express.static(__dirname));
routs.set('view engine', 'jade');
const {userData} = require('../modal/user/login');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

routs.get ('/', (req, res) => {
  res.render('user/login')
})

routs.get ('/user/register', (req, res) => {
  res.render("user/register")
});

routs.get ('/user/startpage', async (req, res) => {
  const username = localStorage.getItem('data');
  const data = userData(username);
  const names = (await data).name;
  const nr_card = (await data).nr_card;
  const cardname = (await data).cardname
  res.render("user/profile", {username, names, nr_card, cardname});
});

routs.get ('/user/errors', (req, res) => {
  res.render("error/errormessage" ,{message:"user allready exist"})
});

routs.get('/payments/addcard',(req, res) => {
  res.render('payments/newcard');
})

routs.get ('/payments/onlinepay', (req, res) => {
    res.render("payments/pay")
})

module.exports = routs;