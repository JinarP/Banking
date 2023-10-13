const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");
const {userData, validData} = require('../database/user/login');
const {checkValidInput} = require('../database/user/register');
const {createacount} = require('../database/user/createAcount')


app.use(express.urlencoded({ extended: true }));

app.post('/user/login', async (req, res) => {
  try {
    const username = req.body.username;
    const psw = req.body.password;

    const usAndPsw = validData(username);
    const users = (await usAndPsw).user;
    const validpsw = (await usAndPsw).pasw;
    if ((users.rows.length > 0 && username === users.rows[0].username) && (psw === validpsw.rows[0].password)) {
      const userdate = userData(username);
      console.log((await userdate).iduser)
      let names = (await userdate).name
      let nr_card = (await userdate).nr_card
      let cardname = (await userdate).cardname

      res.render('profile', { username, names, nr_card, cardname })
    } else {
      const message = "Wrong username or password"
      res.render('errormessage', { message: message });
    }

  } catch (error) {
    console.log(error);
  }
});


app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const newuser = req.body.username;
    const password = req.body.password;
    const names = req.body.names;
    
    if (await checkValidInput(email, newuser)) {
      await createacount(newuser, password, email, names);
      res.json({ success: true });
    } else {
      const message = 'Username allready exist chose ather one'
      res.json({ success: false, message: message });
    }

  } catch (error) {
    console.log(error);
  }
});

module.exports = app;