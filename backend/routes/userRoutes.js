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

// authentication 
router.route('/').get(protect, getAllUsers).post(registerUser)

router.route('/login').post(loginUser)

// settings
router.route('/settings').get(protect, getUserSettings).put(protect, updateUserSettings)

router.route('/settings/changepassword').put(protect, updateUserPassword)

//  admin routes
router.route('/admin').put(protect, updateUserRole)

router.route('/admin/:id').delete(protect, deleteUser)

//  password recovery 
router.route('/forgotpassword/:user').post(forgotPassword)

router.route('/resetpassword').put(resetPassword)


module.exports = router