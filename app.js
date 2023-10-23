const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.set('view engine', 'jade');
app.use(require('./controller/routs'))
const port = 3000;
app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`);
});