const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
  uploadFile,
  deleteFile,
  getFile
} = require('../controllers/fileController')

router.route('/uploadFile').post(uploadFile)
router.route('/deleteFile').post(deleteFile)
router.route('/getFile').get(getFile)



module.exports = router