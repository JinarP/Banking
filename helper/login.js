const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");

async function validData(username) {
  const users = await client.query('SELECT username FROM users WHERE username = $1', [username]);
  const validpsw = await client.query('SELECT password FROM users WHERE username = $1', [username]);

  let data = {
    user: users,
    pasw: validpsw
  }
  return data;
}

async function userData (username) {
      let iduser = await client.query('SELECT id FROM users WHERE username = $1', [username])
      let names = await client.query('SELECT name FROM users WHERE username = $1', [username])
      iduser = iduser.rows[0].id
      names = names.rows[0].name;
      let nr_card = await client.query("SELECT nr_card FROM cards WHERE id_persoana = $1", [iduser]);
      let cardname = await client.query("SELECT cardname FROM cards WHERE id_persoana = $1", [iduser])

      nr_card = nr_card.rows[0].nr_card;
      cardname = cardname.rows[0].cardname;

      let userDatas = {
        name: names,
        iduser: iduser,
        nr_card: nr_card,
        cardname: cardname
      };
      return userDatas;

}

module.exports={userData, validData}

// const {nana, bla} = require("./helper/login")
// const nr = nana();
// const num = bla();
// console.log(nr, num)