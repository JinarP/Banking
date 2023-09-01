const express = require('express');
const app = express();
const client = require("./routes/dbconection");
app.use(express.json())
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));


app.set('view engine', 'jade');
const emailValidator = require('deep-email-validator');
const { error } = require('console');

app.get ('/', (req, res) => {
  res.render('login')
})

app.get ('/register', (req, res) => {
  res.render("register")
});

app.get ('/startpage', (req, res) => {
  res.render("profile")
});

app.get ('/errors', (req, res) => {
  res.render("errormessage" ,{message:"eser allready exist"})
});

let username;
app.post('/login', async (req, res) => {
  try {
    username = req.body.username;
    const psw = req.body.password;
    const users = await client.query('SELECT name FROM users WHERE name = $1', [username]);
    const validpsw = await client.query('SELECT password FROM users WHERE name = $1', [username]);
    if ((users.rows.length > 0 && username === users.rows[0].name) && (psw === validpsw.rows[0].password)) {

      res.render('profile')
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
  
  const exist = await client.query("SELECT id FROM users WHERE name = $1", [user]);
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
    
    if (await checkvalidinput(email, newuser, password, repetpasword)) {
      client.query('INSERT INTO users (name, password, email) VALUES ($1, $2, $3)', [newuser, password, email])
      res.json({ success: true }); // Trimite un răspuns JSON pentru validare reușită
   } else {
     const message = 'Username already exist'
     res.json({ success: false, message: message }); // Trimite un răspuns JSON pentru validare eșuată
   }

  } catch (error) {
    console.log(error);
  }
});

app.get('/addcard',(req, res) => {
  res.render('newcard');
})

module.exports = app;
