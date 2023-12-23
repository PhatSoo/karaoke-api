require('dotenv/config');
const express = require('express');
var cors = require('cors');
const { APIRoute } = require('./routes/api');
const { APPRoute } = require('./routes/app');

const port = process.env.PORT;

var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

APIRoute(app);
APPRoute(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}: http://localhost:${port}`);
});
