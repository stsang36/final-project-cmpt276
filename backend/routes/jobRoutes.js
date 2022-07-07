const express = require("express")
const router = express.Router()

const { getjobs, addJob, deletejob } = require('../controllers/jobsController')

router.route("/").get(getjobs);

router.route("/addnewjob").get(addJob);

router.route("/:id").delete(deletejob)


module.exports = router