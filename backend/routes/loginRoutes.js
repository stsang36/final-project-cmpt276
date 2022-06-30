const express = require('express');
const app = express();


const { loginPostFunction, loginGetFunction } = require('../controllers/loginController');

app.get('/', (req, res) => {loginGetFunction(req, res)});
app.post('/', (req, res) => {loginPostFunction(req, res)});

module.exports = app;