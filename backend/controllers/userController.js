const { pool } = require('../config/pool.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('express-async-errors')

// @route:  GET /api/user
// @desc:   retrieves all users from the database and returns an array of users
// @access: PRIVATE 
const getAllUsers = async(req, res) => {
  const getAllUsersQuery = 'SELECT * FROM "user"'
  const results = await pool.query(getAllUsersQuery)
  res.status(200).json(results.rows)
}

// @route:  POST /api/user
// @desc:   register a new user into the database
// @body:   obj w/ password, username and any other fields
// @access: PUBLIC
const registerUser = async(req, res) => {
  const {username, password, email} = req.body
  if(!username || !password || !email){
    res.status(400)
    throw new Error('missing fields')
  }
  const duplicateUsername = await pool.query('select * from \"user\" where username = $1 limit 1', [username.toLowerCase()])
  if(duplicateUsername.rows[0]){
    res.status(400)
    throw new Error('username already exists')
  }

  const duplicateEmail = await pool.query('select * from \"user\" where username = $1 limit 1', [email.toLowerCase()])
  if(duplicateEmail.rows[0]){
    res.status(400)
    throw new Error('email already in use')
  }


  // hash password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const registerUserQuery = {
    text: 'INSERT into \"user\" VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT, DEFAULT) RETURNING *', 
    values: [username, email, hashedPassword, null]
  }
  const results = await pool.query(registerUserQuery)
  const user = results.rows[0]
  if(user){
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"})
    })
  }else{
    res.status(400)
    throw new Error('invalid user data')
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
    throw new error('missing fields')
  }
  const findUserQuery = {
    text: "SELECT * from \"user\" WHERE username = $1 OR email = $1 limit 1",
    values: [username]
  }
  const results = await pool.query(findUserQuery)
  const user = results.rows[0]
  if(user && (await bcrypt.compare(password, user.password))){
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "3d"})
    })
  }else{
    res.status(400)
    throw new Error('Invalid Credentials')
  }
}

// @route:  GET /api/user/:id
// @desc:   update user data
// @body:   obj w/ new user obj 
// @access: PRIVATE (user can only update themselves)
const getUserSettings = async(req, res) => {
  const { id } = req.params
  if(parseInt(id) !== req.user.id){
    res.status(401)
    throw new Error('Unauthorized Access')
  }
  const getUserSettingsQuery = {
    text: "SELECT id, username, email, discordid, togglediscordpm, toggleemailnotification FROM \"user\" WHERE id = $1 limit 1",
    values: [id]
  }
  const results = await pool.query(getUserSettingsQuery)
  const userSettings = results.rows[0]
  // return obj in camel case
  res.status(200).json({
    id: userSettings.id,
    username: userSettings.username,
    email: userSettings.email,
    discordId: userSettings.discordid,
    toggleDiscordPm: userSettings.togglediscordpm,
    toggleEmailNotification: userSettings.toggleemailnotification
  })
}

// @route:  PUT /api/user
// @desc:   update user data
// @body:   obj w/ new user obj 
// @access: PRIVATE (user can only update themselves)
const updateUserSettings = async(req, res) => {
  if(req.user.id !== parseInt(req.body.id)){
    res.status(401)
    throw new Error('Unauthorized Access')
  }
  const { id, username, email, discordId, toggleDiscordPm, toggleEmailNotification } = req.body
  const duplicateUsername = await pool.query('SELECT * from \"user\" WHERE username = $1 AND id != $2 limit 1', [username.toLowerCase(), id])
  if(duplicateUsername.rows[0]){
    res.status(400)
    throw new Error('username is already taken')
  }

  const duplicateEmail = await pool.query('SELECT * from \"user\" WHERE email = $1 AND id != $2 limit 1', [email.toLowerCase(), id])
  if(duplicateEmail.rows[0]){
    res.status(400)
    throw new Error('email already in use')
  }
  
  const updateUserSettingsQuery = {
    text: 'UPDATE \"user\" SET username = $1, email = $2, discordid = $3, togglediscordpm = $4, toggleemailnotification = $5 where id = $6 RETURNING *',
    values: [username, email, discordId, toggleDiscordPm, toggleEmailNotification, id]
  }
  const results = await pool.query(updateUserSettingsQuery)
  const updatedUserSettings = results.rows[0]
  res.status(200).json({
    username: updatedUserSettings.username,
    email: updatedUserSettings.email,
  })
}
// @route:  PUT /api/user/changepassword
// @desc:   update user password
// @body:   obj w/ fields { id: <<USERID>>, newPassword: <<newPassword>>, oldPassword: <<oldPassword>> }
// @access: PRIVATE 
const updateUserPassword = async(req, res) => {
  if(req.user.id !== parseInt(req.body.id)){
    res.status(400)
    throw new Error('Unauthorized Access')
  }
  const { id, newPassword, oldPassword } = req.body
  const results = await pool.query('SELECT * FROM \"user\" WHERE id = $1 limit 1', [id])
  const user = results.rows[0]
  if(user && (await bcrypt.compare(oldPassword, user.password))){
    const saltRounds = 10
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds)
    await pool.query('UPDATE \"user\" SET password = $1 WHERE id = $2', [newHashedPassword, id])
    res.status(200).json({message: 'success'})
  } else{
    res.status(400)
    throw new Error('Invalid Credentials')
  }
}

// @route:  PUT /api/user/:id
// @desc:   update user role
// @params: id of user to be updated
// @body:   obj w/ field {role: <<NEW ROLE>>}
// @access: PRIVATE (ADMIN)
const updateUserRole = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(401)
    throw new Error('Unauthorized Access')
  }
  const { id } = req.params
  const role = req.body.role.toLowerCase()
  if(!id || !role){
    res.status(400)
    throw new Error('Missing Fields')
  }
  if(!(role === 'admin' || role === 'client' || role === 'transcriber' || role === 'reviewer')){
    res.status(400)
    throw new Error('role is not viable')
  }
  const updateUserRoleQuery ={
    text: 'UPDATE \"user\" SET role = $1 WHERE id = $2',
    values: [role, id]
  }
  await pool.query(updateUserRoleQuery)
  res.status(200).json({message: "success"})
}

// @route:  DELETE /api/user/:id
// @desc:   delete user
// @params: id with the user id 
// @access: PRIVATE (ADMIN)
const deleteUser = async(req, res) => {
  if(req.user.role !== 'admin'){
    res.status(400)
    throw new Error('Unauthorized Access')
  }
  const { id } = req.params
  if(!id){
    res.status(400)
    throw new Error('Missing \"id\" Parameter')
  }
  const deleteUserQuery ={
    text: 'DELETE from \"user\" WHERE id = $1 ',
    values: [id]
  } 
  await pool.query(deleteUserQuery)
  res.status(200).json({message: "success"})
}


module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUserRole,
  deleteUser,
  updateUserSettings,
  updateUserPassword,
  getUserSettings,
}