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
  forgotPassword,
  resetPassword,
} = require('../controllers/userController')

router.route('/').get(protect, getAllUsers).post(registerUser).put(protect, updateUserSettings)

router.route('/login').post(loginUser)

router.route('/changepassword').put(protect, updateUserPassword)

router.route('/actions/:id').delete(protect, deleteUser).put(protect, updateUserRole).get(protect, getUserSettings)

router.route('/forgotpassword/:user').post(forgotPassword)

router.route('/resetpassword').put(resetPassword)


module.exports = router