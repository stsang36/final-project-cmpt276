const { pool } = require('../config/pool.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('express-async-errors')

// @route:  GET /api/user
// @desc:   retrieves all users from the database and returns an array of users
// @access: PRIVATE 
const getAllUsers = async(req, res) => {
  const getAllUsersQuery = 'SELECT id, username, role FROM "user"'
  const results = await pool.query(getAllUsersQuery)
  res.status(200).json(results.rows)
}

// @route:  POST /api/user
// @desc:   register a new user into the database
// @body:   obj w/ password, username and any other fields
// @access: PUBLIC
const registerUser = async(req, res) => {
  const {username, password, email} = req.body
  if(!username || !password){
    res.status(400)
    throw new Error('Missing fields!')
  }
  const duplicateUser = await pool.query('select * from \"user\" where username = $1 limit 1', [username])
  if(duplicateUser.rows[0]){
    res.status(400)
    throw new Error('username already exists')
  }

  // hash password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const registerUserQuery = {
    text: 'INSERT into \"user\" VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *', 
    values: [username, email, hashedPassword, null, "client", false, true]
  }
  const results = await pool.query(registerUserQuery)
  const user = results.rows[0]
  if(user){
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"})
    })
  }else{
    res.status(400)
    throw new Error('Invalid User data')
  }
}

// @route:  POST /api/user/login
// @desc:   login user
// @body:   obj w/ username and password
// @access: PUBLIC
const loginUser = async(req, res) => {
  const {username, password} = req.body
  if(!username || !password){
    res.status(400)
    throw new error('Missing Fields')
  }
  const findUserQuery = {
    text: "SELECT * from \"user\" WHERE username = $1 limit 1",
    values: [username]
  }
  const results = await pool.query(findUserQuery)
  const user = results.rows[0]
  if(user && (await bcrypt.compare(password, user.password))){
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "3d"})
    })
  }else{
    res.status(400)
    throw new Error('Invalid Credentials')
  }
}

// @route:  PUT /api/user
// @desc:   update user
// @body:   obj w/ user id and new role
// @access: PRIVATE (ADMIN)
const updateUserRole = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(400)
    throw new Error('Unauthorized Access')
  }
  const {id, role} = req.body
  if(!id || !role){
    res.status(400)
    throw new Error('Missing Fields')
  }
  const updateUserRoleQuery ={
    text: 'UPDATE \"user\" SET role = $1 WHERE id = $2',
    values: [role, id]
  }
  await pool.query(updateUserRoleQuery)
  res.status(200).json({message: "success"})
}


module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUserRole,
}