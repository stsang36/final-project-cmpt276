const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
  uploadFile,
  deleteFile,
  getFile
} = require('../controllers/fileController')

router.route('/uploadFile').post(protect, uploadFile)
router.route('/deleteFile').post(protect, deleteFile)
router.route('/getFile').get(protect, getFile)



module.exports = router