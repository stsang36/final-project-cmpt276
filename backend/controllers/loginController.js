// handles all functions that are called in the login route
const express = require('express');
const app = express();
const path = require('path');
const frontend = path.join(__dirname, '..', '..', 'client');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;
dotenv.config({path: '../.env'});


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

app.use(express.static(frontend));
app.set('views', frontend + '/public');

const loginGetFunction = (req, res) => {
    // insert get function here 
    console.log('login get function called');
    res.sendFile('index.html', {root: app.get('views')});
    
    //res.status(200).send({message: 'success'});

    return;
}
  
const loginPostFunction = async (req, res) => {
    // insert post function here
    console.log('login post function called');

    try {
        let client = await pool.connect();
        let result = await client.query('SELECT * FROM user_table WHERE username = $1', [req.body.f_username]);
        let user = { 'info': (result) ? result.rows : null};
        client.release();
        
        if (user.info.length === 0) {
            res.status(401).send({message: 'username not found'});
            console.log('username not found');
            return;
        }

        let plainPwd = req.body.f_password;

        let match = await bcrypt.compare(plainPwd, user.info[0].password);

        if (match) {
            res.status(200).send({message: 'user authenticated'});
            console.log('pass success');
            return;
        } else {
            res.status(401).send({message: 'username or password incorrect'});
            console.log('password incorrect');
            return;
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({message: 'error'});
    }
    
    
    return;
}

const registerGetFunction = (req, res) => {
    console.log('register get function called');
    res.status(200).send({message: 'success'});
    return;
}

const registerPostFunction = async (req, res) => {
    console.log('register post function called');
    res.status(200).send({message: 'success'});
    return;
}

const hashPwd = async (pwd) => {

    try {
        let myPwd = pwd; // pwd is the password that is being hashed
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(myPwd, salt);
        
        return hash;
    } catch (err) {
        console.log(err);    
    }
    return;
}


module.exports = { 
    loginGetFunction, 
    loginPostFunction,
    registerGetFunction,
    registerPostFunction
}