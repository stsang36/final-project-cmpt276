const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getAppConfig, updateAppConfig } = require('../controllers/configController')

router.route('/').get(protect, getAppConfig).put(protect, updateAppConfig)

module.exports = router