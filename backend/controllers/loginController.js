// handles all functions that are called in the login route
const express = require('express');
const app = express();
const path = require('path');

const frontend = path.join(__dirname, '..', '..', 'client')

app.use(express.static(frontend + '/public'));


const loginGetFunction = (req, res) => {
    // insert get function here 
    console.log('login get function called')

    res.status(200).send({message: 'success'})

    return;
}
  
const loginPostFunction = async (req, res) => {
    // insert post function here
    console.log('login post function called')
    res.status(200).send({message: 'success'})
    
    return;
}

const registerGetFunction = (req, res) => {
    console.log('register get function called');
    res.status(200).send({message: 'success'})
    return;
}

const registerPostFunction = async (req, res) => {
    console.log('register post function called')
    res.status(200).send({message: 'success'})
    return;
}
  
module.exports = { 
    loginGetFunction, 
    loginPostFunction,
    registerGetFunction,
    registerPostFunction
}