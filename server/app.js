require('ignore-styles');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const path = require('path');
const fs = require('fs');

require('babel-register')({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app']
});

const index = require('./routes/index');
const universalLoader = require('./universal');

const app = express();

app.set('trust proxy', true);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);

app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use('/', universalLoader);

module.exports = app;
