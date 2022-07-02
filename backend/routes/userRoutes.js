const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
  getAllUsers,
  registerUser,
  loginUser,
  updateUserRole,
} = require('../controllers/userController')

router.route('/').get( getAllUsers).post(registerUser).put(protect, updateUserRole)

router.route('/login').post(loginUser)


module.exports = router