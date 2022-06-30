const express = require('express');
const app = express();


const { loginPostFunction, loginGetFunction, registerGetFunction } = require('../controllers/loginController');



app.get('/', (req, res) => {loginGetFunction(req, res)});
app.post('/', (req, res) => {loginPostFunction(req, res)});

app.get('/register', (req, res) => {registerGetFunction(req, res)});

module.exports = app; 