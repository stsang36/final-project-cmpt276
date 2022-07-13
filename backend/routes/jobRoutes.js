const express = require("express")
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { 
  getJobsByRole,
  getCurrentJobs,
  getPastJobs,
  getMyJobs,
  deletejob,
  addJob, 
  updateJob,
  claimJob,
  dropJob,
} = require('../controllers/jobsController')

router.route("/").get(protect, getJobsByRole).post(protect, addJob)

router.route("/update/:id").put(protect, updateJob)

router.route('/claim/:id').put(protect, claimJob)

router.route('/drop/:id').put(protect, dropJob)

router.route("/my").get(protect, getMyJobs)

router.route('/current').get(protect, getCurrentJobs)

router.route('/past').get(protect, getPastJobs)

router.route("/delete/:id").delete(deletejob)



module.exports = router