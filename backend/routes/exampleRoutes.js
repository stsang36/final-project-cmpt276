// handles all routes starting with '/exampleRoute', delete later
const express = require('express')
const router = express.Router()
const { examplePostFunction, exampleGetFunction } = require('../controllers/exampleController')

// routes already appened with './exampleRoutes' from server
router.route('/').get(exampleGetFunction).post(examplePostFunction)



module.exports = router