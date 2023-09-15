const express = require('express');
const app = express();
const client = require("./routes/dbconection");

app.use(express.json())
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
let username;
let iduser;
let names;
let nr_card;

app.set('view engine', 'jade');
const emailValidator = require('deep-email-validator');

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
  res.render("errormessage" ,{message:"eser allready exist"})
});


app.post('/login', async (req, res) => {
  try {
    username = req.body.username;
    const psw = req.body.password;
    const users = await client.query('SELECT username FROM users WHERE username = $1', [username]);
    const validpsw = await client.query('SELECT password FROM users WHERE username = $1', [username]);

    if ((users.rows.length > 0 && username === users.rows[0].username) && (psw === validpsw.rows[0].password)) {
      iduser = await client.query('SELECT id FROM users WHERE username = $1', [username])
      names = await client.query('SELECT name FROM users WHERE username = $1', [username])
      iduser = iduser.rows[0].id
      names = names.rows[0].name;
      
      nr_card = await client.query("SELECT nr_card FROM cards WHERE id_persoana = $1", [iduser]);
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

app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const newuser = req.body.username;
    const password = req.body.password;
    const repetpasword = req.body.password2;
    names = req.body.names;
    
    if (await checkvalidinput(email, newuser, password, repetpasword)) {
      client.query('INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3)', [newuser, password, email, names])
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

app.get ('/paynew', (req, res) => {
    res.send('https://www.digi.ro/plata')
})

module.exports = app;