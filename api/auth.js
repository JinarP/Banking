const express = require('express');
const router = express.Router()
const client = require("../database/dbconection");
const emailValidator = require('deep-email-validator');

router.use(express.urlencoded({ extended: true }));

router.post('/login', async (req, res) => {
  try {
    const username =  req.body.username;
    console.log(req.body)
    const psw = req.body.password;
    const users = await client.query('SELECT username FROM users WHERE username = $1', [username]);
    const validpsw = await client.query('SELECT password FROM users WHERE username = $1', [username]);

    if ((users.rows.length > 0 && username === users.rows[0].username) && (psw === validpsw.rows[0].password)) {
      let  iduser = await client.query('SELECT id FROM users WHERE username = $1', [username])
      let names = await client.query('SELECT name FROM users WHERE username = $1', [username])
      iduser = iduser.rows[0].id
      names = names.rows[0].name;
      
      let nr_card = await client.query("SELECT nr_card FROM cards WHERE id_persoana = $1", [iduser]);
      let cardname = await client.query("SELECT cardname FROM cards WHERE id_persoana = $1", [iduser])

      nr_card = nr_card.rows[0].nr_card;
      cardname = cardname.rows[0].cardname;
      
      res.render('profile', {username, names, nr_card, cardname})
    } else {
      const message = "Wrong username or password"
      res.render('errormessage', {message: message});
    }
  
  } catch (error) {
    console.log(error);
  }
});

async function checkvalidinput (email, user, pasw, pasw2) {
    if (!emailValidator.validate(email)) {
      return false;
    }
    
    const exist = await client.query("SELECT id FROM users WHERE username = $1", [user]);
    if (exist.rowCount > 0) {
        return false;
        
    }
    
    if (pasw != pasw2) {
      return false
    }
  
    return true;
  }
  
router.post('/register', async (req, res) => {
    try {
      const email = req.body.email;
      const newuser = req.body.username;
      const password = req.body.password;
      const repetpasword = req.body.password2;
      const names = req.body.names;
      
      if (await checkvalidinput(email, newuser, password, repetpasword)) {
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
  
module.exports = router;