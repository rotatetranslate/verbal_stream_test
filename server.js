require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const record = require('node-record-lpcm16');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));


const routes = require('./routes');

app.use('/', routes);

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`app listening on ${port}`));
