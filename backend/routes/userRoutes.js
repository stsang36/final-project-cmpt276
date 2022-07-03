const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
  getAllUsers,
  registerUser,
  loginUser,
  updateUserRole,
  deleteUser,
  updateUserSettings,
  updateUserPassword,
  getUserSettings,
} = require('../controllers/userController')

router.route('/').get(protect, getAllUsers).post(registerUser).put(protect, updateUserSettings)

router.route('/login').post(loginUser)

router.route('/changepassword').put(protect, updateUserPassword)

router.route('/:id').delete(protect, deleteUser).put(protect, updateUserRole).get(protect, getUserSettings)


module.exports = router