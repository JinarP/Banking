const express = require('express');
const app = express.Router()
const client = require("../database/dbconection");
const emailValidator = require('deep-email-validator');

async function checkValidInput(email, user) {
    if (!emailValidator.validate(email)) {
      return false;
    }
  
    const exist = await client.query("SELECT id FROM users WHERE username = $1", [user]);
    if (exist.rowCount > 0) {
      return false;
    }
  
    return true;
  }

  module.exports = {checkValidInput}