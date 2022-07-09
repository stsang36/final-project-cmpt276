const express = require("express")
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getAllJobs, addJob, deletejob } = require('../controllers/jobsController')

router.route("/").get(protect, getAllJobs).post(protect, addJob)

router.route("/:id").delete(deletejob)


module.exports = router