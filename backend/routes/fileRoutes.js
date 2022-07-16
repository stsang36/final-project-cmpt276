const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
  uploadFile,
  deleteFile,
  getFile
} = require('../controllers/fileController')

router.route('/').post(protect, uploadFile).delete(protect, deleteFile)
router.route('/:id').get(protect, getFile)

module.exports = router