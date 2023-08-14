const express = require('express');
const app = express();
const client = require("./routes/dbconection");
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));


app.set('view engine', 'jade');
const emailValidator = require('deep-email-validator');
const { error } = require('console');

app.get ('/', (req, res) => {
  res.render('login')
})

app.get ('/register', (req, res) => {
  res.render('register')
});

let username;
app.post('/login', async (req, res) => {
  try {
    username = req.body.username;
    const psw = req.body.password;
    const users = await client.query('SELECT name FROM users WHERE name = $1', [username]);
    const validpsw = await client.query('SELECT password FROM users WHERE name = $1', [username]);
    if ((users.rows.length > 0 && username === users.rows[0].name) && (psw === validpsw.rows[0].password)) {
      res.render('startpage')
    } else {
      const message = "Wrong username or password"
      res.render('wrongmessage', {message: message});
    }
  } catch (error) {
    console.log(error);
  }
});

function checkvalidinput(email, user, pasw, pasw2) {
  if (!emailValidator.validate(email)) {
    return false;
  }

  const exist = client.query("SELECT name FROM users WHERE name = $1", [user]);
  if (exist.rowCount === 0) {
      return false;
  }
  
  if (pasw != pasw2) {
    return false
  }

  return true;
}

/*app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const newuser = req.body.usname;
    const password = req.body.password;
    const repetpasword = req.body.repetpw;

    if (checkvalidinput(email, newuser, password, repetpasword)) {
      res.render('startpage')
    } else {
      const message = 'sumphing is wrong'
      res.render('errormessage' , {message: message});
    }

  } catch (error) {
    console.log(error);
  }

});*/

module.exports = app;
