function nana() {
  let a = 1;
  return a;
}
function bla() {
  let b = 'ana'
  return b
}
module.exports={nana, bla}
const {nana, bla} = require("./helper/login")
const nr = nana();
const num = bla();
console.log(nr, num)