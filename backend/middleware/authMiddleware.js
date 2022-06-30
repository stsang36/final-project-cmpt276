const jwt = require('jsonwebtoken')
const { pool } = require('../config/pool')
require('express-async-errors')

const protect = async(req, res, next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    // get token from header
    token = req.headers.authorization.split(' ')[1]

    // get user from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const getUserQuery = {
      text: 'SELECT id, username, email, role, discordid, togglediscordpm, toggleemailnotification from \"user\" WHERE id = $1 limit 1',
      values: [decoded.id]
    }
    const results = await pool.query(getUserQuery)
    const user = results.rows[0]
    if(!user){
      res.status(401)
      throw new Error('Not Authorized')
    }
    req.user = user;
    next()
  }
  if(!token){
    res.status(401)
    throw new Error('Not Authorized')
  }
}

module.exports = { protect }