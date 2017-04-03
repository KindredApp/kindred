const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

let PORT = process.env.PORT || 1337;


const app = express();
const jsonParser = bodyParser.json();

app.use(jsonParser);

app.use(express.static(path.join(__dirname, '../public')));

app.use('/bundles', express.static(path.join(__dirname, '../bundles')));


app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}.`);
});

