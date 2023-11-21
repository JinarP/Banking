const express = require('express');
const app = express.Router()
const {userData, getUserByUsername} = require('../model/user');
const {checkValidInput} = require('../model/user');
const {createAcount} = require('../model/user')
app.use(express.urlencoded({ extended: true }));
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

let id;
app.post('/user/login/', async (req, res) => {
  try {
    const username = req.body.username;
    const psw = req.body.password;
    const usAndPsw = getUserByUsername(username);
    const users = (await usAndPsw).user;
    const validpsw = (await usAndPsw).pasw;
    if ((users.rows.length > 0 && username === users.rows[0].username) && (psw === validpsw.rows[0].password)) {
      const userdate = userData(username);
      localStorage.setItem('data', username)
      id = (await userdate).iduser
      let names = (await userdate).name
      let nr_card = (await userdate).nr_card
      let cardname = (await userdate).cardname
      res.render('user/profile', {username, names, nr_card, cardname})
    } else {
      const message = "Wrong username or password"
      res.render('error/errormessage', { message: message });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post('/user/register', async (req, res) => {
  try {
    const email = req.body.email;
    const newuser = req.body.username;
    const password = req.body.password;
    const names = req.body.names;
    if (await checkValidInput(email, newuser)) {
      await createAcount(newuser, password, email, names);
      res.json({ success: true });
    } else {
      const message = 'Username allready exist chose ather one'
      res.json({ success: false, message: message });
    }

  } catch (error) {
    console.log(error);
  }
});

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

module.exports = app;