const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");
const {userData, validData} = require('../helper/login');
const {checkValidInput} = require('../helper/register');

app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
  try {
    const username = req.body.username;
    const psw = req.body.password;

    const usAndPsw = validData(username);
    const users = (await usAndPsw).user;
    const validpsw = (await usAndPsw).pasw;
    if ((users.rows.length > 0 && username === users.rows[0].username) && (psw === validpsw.rows[0].password)) {
      const userdate = userData(username);
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
      client.query('INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)', [newuser, password, email, names])
      iduser = await client.query('SELECT id FROM users WHERE username = $1', [newuser]);
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