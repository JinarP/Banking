const express = require('express');
const app = express();
const client = require("./routes/dbconection");
//const client = require("./routes/dbconection");
let path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set('view engine', 'jade');


app.get ('/', (req, res) => {
  res.render('login')
})

app.get ('/register', (req, res) => {
  res.render('register')
});

app.post ('/login', (req, res) => {
  res.render('startpage')
})

module.exports = app;
